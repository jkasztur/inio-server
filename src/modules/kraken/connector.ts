import { IConnector } from "../types";
import { AxiosInstance } from "axios";
import crypto from 'crypto'

export class KrakenConnector implements IConnector {

	key: string
	secret: string
	/**
	 * @injectable(modules.kraken.connector)
	 * @param client @inject(clients.kraken)
	 */
	constructor(private client: AxiosInstance) {
		this.key = 'BoGIAuCT3iF4KRDAxKRw4s2yEbml8wy+378gkauKRGTtOEsM0pQ8fDQk'
		this.secret = 'Aku3pYBBrHdiC7Y/SobY+wP/RT7wtkmPUbAvrcgpshmqPEmAg87q7W90gQxa/gQIbbCztazaprrGzpI41d61cA=='
	}

	async getBalance() {
		const params = new URLSearchParams()
		params.append('nonce', String(new Date().getTime()))
		params.append('asset', 'ZUSD')

		const apiSign = this.getApiSign(this.secret, '/0/private/TradeBalance', params)
		const response = await this.client.post('/0/private/TradeBalance', params, {
			headers: {
				'API-Key': this.key,
				'API-Sign': apiSign
			}
		})

		return {
			amount: this.sumBalances(response.data),
			currency: 'USD'
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