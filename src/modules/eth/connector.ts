import { AddressSetup, ApiSecretSetup, IConnector } from "../types";
import { AxiosInstance } from "axios";
import crypto from 'crypto'
import { KrakenCredentials } from "../../database/models/KrakenCredentials";
import { CurrencyService } from "../../app/currencyService";
import { Address } from "../../database/models/Address";
import { BinanceService } from "../binance/service";
import { WhitelistedContract } from "../../database/models/WhitelistedContract";

export const CHAIN_NAME = 'eth'
export class EthereumChainConnector implements IConnector<AddressSetup> {

	/**
	 * @injectable(modules.eth.connector)
	 * @param client @inject(modules.eth.client)
	 * @param currencyService @inject(app.currencyService)
	 */
	constructor(
		private client: AxiosInstance,
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
		const whitelistedContracts = [] // TODO

		const ethBalance = await this.getEthBalance(address)
		const ethPrice = await this.getEthPrice()
		const ethInUsd = ethBalance * ethPrice
		const converted = await this.currencyService.convert(ethInUsd, 'USD', currency)
		return {
			amount: converted,
			currency
		}
	}

	async getEthBalance(address: Address): Promise<number> {
		const response = await this.client('/', {
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

	async getEthPrice(): Promise<number> {
		const response = await this.client('/', {
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

	async whitelist(accountId: number, contract: string) {
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
				contract
			}
		})
		if (existing) {
			return
		}
		await WhitelistedContract.create({
			address_id: address.id,
			contract
		})
	}
}
