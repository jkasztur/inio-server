import { IConnector } from "../types";
import { AxiosInstance } from "axios";
import crypto from 'crypto'
import { KrakenCredentials } from "../../database/models/KrakenCredentials";
import { CurrencyService } from "../../app/currencyService";

export class KrakenConnector implements IConnector<KrakenSetup> {

	/**
	 * @injectable(modules.kraken.connector)
	 * @param client @inject(clients.kraken)
	 * @param currencyService @inject(app.currencyService)
	 */
	constructor(private client: AxiosInstance, private currencyService: CurrencyService) {
	}

	async getBalance(accountId: number, currency: string) {
		const credentials: KrakenCredentials = await KrakenCredentials.findOne({
			where: {
				account_id: accountId
			}
		})
		if (!credentials) {
			return {
				amount: -1,
				currency: 'USD'
			}
		}

		const params = new URLSearchParams()
		params.append('nonce', String(new Date().getTime()))
		params.append('asset', 'ZUSD')

		const apiSign = this.getApiSign(credentials.secret, '/0/private/TradeBalance', params)
		const response = await this.client.post('/0/private/TradeBalance', params, {
			headers: {
				'API-Key': credentials.api_key,
				'API-Sign': apiSign
			}
		})

		if (response.data.error && response.data.error.length > 0) {
			throw new Error(`Kraken error: ${response.data.error}`)
		}

		const usdAmount = this.sumBalances(response.data)
		let amount: number
		if (currency === 'usd') {
			amount = usdAmount
		} else {
			amount = await this.currencyService.convert(usdAmount, 'usd', currency)
		}
		return {
			amount,
			currency
		}
	}

	async setup(accountId: number, data: KrakenSetup) {
		const existing: KrakenCredentials = await KrakenCredentials.findOne({
			where: {
				account_id: accountId
			}
		})

		if (existing) {
			await existing.update({
				api_key: data.apiKey,
				secret: data.secret
			})
		} else {
			await KrakenCredentials.create({
				account_id: accountId,
				api_key: data.apiKey,
				secret: data.secret
			})
		}
	}

	private getApiSign(secret: string, uriPath: string, payload: URLSearchParams): string {
		const secretBuffer = Buffer.from(secret, 'base64')
		const hash = crypto.createHash('sha256')
		const hmac = crypto.createHmac('sha512', secretBuffer)
		const hashDigest = hash.update(payload.get('nonce') + payload.toString()).digest().toString('binary')
		const hmacDigest = hmac.update(uriPath + hashDigest, 'binary').digest('base64')

		return hmacDigest
	}

	private sumBalances(response: TradeBalanceResponse): number {
		const sum = Object.values(response.result).reduce<number>((total, current) => {
			return total + Number.parseFloat(current)
		}, 0)

		return parseFloat(sum.toFixed(2))
	}
}

type TradeBalanceResponse = {
	result: {
		[key: string]: string
	}
}

type KrakenSetup = {
	apiKey: string,
	secret: string
}
