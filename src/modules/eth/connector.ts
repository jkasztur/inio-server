import { AddressSetup, ApiSecretSetup, IConnector } from "../types";
import { AxiosInstance } from "axios";
import crypto from 'crypto'
import { KrakenCredentials } from "../../database/models/KrakenCredentials";
import { CurrencyService } from "../../app/currencyService";
import { Address } from "../../database/models/Address";

export const CHAIN_NAME = 'eth'
export class EthereumChainConnector implements IConnector<AddressSetup> {

	/**
	 * @injectable(modules.eth.connector)
	 * @param client @inject(modules.eth.client)
	 * @param currencyService @inject(app.currencyService)
	 */
	constructor(private client: AxiosInstance, private currencyService: CurrencyService) {
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

		return {
			amount: 0,
			currency
		}
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
}
