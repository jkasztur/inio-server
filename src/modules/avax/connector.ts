import { AxiosInstance } from "axios";
import { CurrencyService } from "../../app/currencyService";
import { Address } from "../../database/models/Address";
import { IConnector, AddressSetup, Balance } from "../types";

export const CHAIN_NAME = 'avax'
export class AvaxConnector implements IConnector<AddressSetup> {

	/**
	 * @injectable(modules.avax.connector)
	 * @param avaxClient @inject(modules.avax.client)
	 * @param coingeckoClient @inject(clients.coingecko)
	 * @param currencyService @inject(app.currencyService)
	 */
	constructor(
		private avaxClient: AxiosInstance,
		private coingeckoClient: AxiosInstance,
		private currencyService: CurrencyService) {
	}

	async getBalance(accountId: number, currency: string): Promise<Balance> {
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
		// AVAX
		const avaxBalance = await this.getAvaxBalance(address)

		const avaxPrice = await this.getAvaxPrice()
		const avaxInUsd = avaxBalance * avaxPrice

		const converted = await this.currencyService.convert(avaxInUsd, 'USD', currency)
		return {
			amount: converted,
			currency
		}
	}

	async getAvaxBalance(address: Address): Promise<number> {
		const response = await this.avaxClient.post('/ext/bc/C/rpc', {
			jsonrpc: "2.0",
			id: 1,
			method: "eth_getBalance",
			params: [
				address.address,
				"latest"
			]
		})

		const weiCount = Number.parseInt(response.data.result, 16)
		const avaxCount = weiCount / parseFloat('1000000000000000000')

		return avaxCount
	}

	async getAvaxPrice(): Promise<number> {
		const res = await this.coingeckoClient.get('/v3/asset_platforms')
		console.log(res.data);

		const response = await this.coingeckoClient.get('/v3/simple/token_price/avalanche', {
			params: {
				contract_addresses: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
				vs_currencies: 'usd'
			}
		})

		return Object.values(response.data)[0]['usd']
	}

	async setup(accountId: number, data: AddressSetup): Promise<void> {
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
}