import { AddressSetup, ApiSecretSetup, IConnector } from "../types";
import { AxiosInstance } from "axios";
import crypto from 'crypto'
import { KrakenCredentials } from "../../database/models/KrakenCredentials";
import { CurrencyService } from "../../app/currencyService";
import { Address } from "../../database/models/Address";
import { BinanceService } from "../binance/service";
import { WhitelistedContract } from "../../database/models/WhitelistedContract";
import { runInThisContext } from "vm";

export const CHAIN_NAME = 'eth'
export class EthereumChainConnector implements IConnector<AddressSetup> {

	/**
	 * @injectable(modules.eth.connector)
	 * @param client @inject(modules.eth.client)
	 * @param coingeckoClient @inject(clients.coingecko)
	 * @param currencyService @inject(app.currencyService)
	 */
	constructor(
		private etherscanClient: AxiosInstance,
		private coingeckoClient: AxiosInstance,
		private currencyService: CurrencyService) {
	}

	async getBalance(accountId: number, currency: string) {
		const address: Address = await Address.findOne({
			where: {
				account_id: accountId,
				chain: CHAIN_NAME
			}
		})
		if (!address) {
			return {
				amount: -1,
				currency: 'USD'
			}
		}
		// ETH
		const ethBalance = await this.getEthBalance(address)
		const ethPrice = await this.getEthPrice()
		const ethInUsd = ethBalance * ethPrice

		// Other contracts
		const contractsInUsd = await this.getContractsInUsd(address)

		const converted = await this.currencyService.convert(ethInUsd + contractsInUsd, 'USD', currency)
		return {
			amount: converted,
			currency
		}
	}

	async getContractsInUsd(address: Address): Promise<number> {
		const contracts: WhitelistedContract[] = await WhitelistedContract.findAll({
			where: {
				address_id: address.id,
			}
		})
		if (contracts.length === 0) {
			return 0
		}
		let usdAmount = 0

		await Promise.all(contracts.map(async (contract) => {
			const balanceResponse = await this.etherscanClient('/', {
				params: {
					module: 'account',
					action: 'tokenbalance',
					address: address.address,
					contractaddress: contract.contract,
					apiKey: process.env.ETHERSCAN_API_KEY
				}
			})
			const weiCount = parseFloat(balanceResponse.data.result)
			const tokenCount = weiCount / parseFloat('1000000000000000000')
			if (tokenCount === 0) {
				return
			}
			const tokenPrice = await this.getContractPrice(contract.contract)
			usdAmount += (tokenPrice * tokenCount)
		}))

		return usdAmount
	}

	async getEthBalance(address: Address): Promise<number> {
		const response = await this.etherscanClient('/', {
			params: {
				module: 'account',
				action: 'balance',
				address: address.address,
				apiKey: process.env.ETHERSCAN_API_KEY
			}
		})
		const weiCount = parseFloat(response.data.result)
		const ethCount = weiCount / parseFloat('1000000000000000000')

		return ethCount
	}

	async getContractPrice(contractAddress: string): Promise<number> {
		const response = await this.coingeckoClient.get('/v3/simple/token_price/ethereum', {
			params: {
				contract_addresses: contractAddress,
				vs_currencies: 'usd'
			}
		})

		return Object.values(response.data)[0]['usd']
	}

	async getEthPrice(): Promise<number> {
		const response = await this.etherscanClient('/', {
			params: {
				module: 'stats',
				action: 'ethprice',
				apiKey: process.env.ETHERSCAN_API_KEY
			}
		})
		return parseFloat(response.data.result.ethusd)
	}

	async setup(accountId: number, data: AddressSetup) {
		const existing: Address = await Address.findOne({
			where: {
				account_id: accountId,
				chain: CHAIN_NAME
			}
		})

		if (existing) {
			await existing.update({
				address: data.address,
			})
		} else {
			await Address.create({
				account_id: accountId,
				address: data.address,
				chain: CHAIN_NAME
			})
		}
	}

	async whitelist(accountId: number, data: AddressSetup) {
		const address: Address = await Address.findOne({
			where: {
				account_id: accountId,
				chain: CHAIN_NAME
			}
		})
		if (!address) {
			throw new Error('Address is not set!')
		}

		const existing: WhitelistedContract = await WhitelistedContract.findOne({
			where: {
				address_id: address.id,
				contract: data.address
			}
		})
		if (existing) {
			return
		}
		await WhitelistedContract.create({
			address_id: address.id,
			contract: data.address
		})
	}

	async getWhitelisted(accountId: number): Promise<string[]> {
		const address: Address = await Address.findOne({
			where: {
				account_id: accountId,
				chain: CHAIN_NAME
			}
		})
		if (!address) {
			return []
		}
		const existing: WhitelistedContract[] = await WhitelistedContract.findAll({
			where: {
				address_id: address.id
			}
		})

		return existing.map(contract => contract.contract)
	}

	async removeWhitelisted(accountId: number, contractAddress: string) {
		const address: Address = await Address.findOne({
			where: {
				account_id: accountId,
				chain: CHAIN_NAME
			}
		})
		if (!address) {
			return
		}

		await WhitelistedContract.destroy({
			where: {
				address_id: address.id,
				contract: contractAddress
			}
		})
	}
}
