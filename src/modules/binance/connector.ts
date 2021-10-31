import { IConnector } from "../types";
import { AxiosInstance } from "axios";
import { CurrencyService } from "../../app/currencyService";
import crypto from 'crypto'
import qs from "qs";
import { BinanceCredentials } from "../../database/models/BinanceCredentials";

export class BinanceConnector implements IConnector<BinanceSetup> {
	/**
	 * @injectable(modules.binance.connector)
	 * @param client @inject(modules.binance.client)
	 * @param currencyService @inject(app.currencyService)
	 */
	constructor(private client: AxiosInstance, private currencyService: CurrencyService) {
	}

	async getBalance(accountId: number, currency: string) {
		const credentials: BinanceCredentials = await BinanceCredentials.findOne({
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

		const spotBalance = await this.getSpotBalance(credentials)
		const savingsBalance = await this.getSavingsBalance(credentials)
		const marginBalance = await this.getMarginBalance(credentials)

		const totalInUSDT = spotBalance + savingsBalance + marginBalance
		const converted = await this.currencyService.convert(totalInUSDT, 'USD', currency)
		return {
			amount: converted,
			currency: currency
		}
	}

	private async getMarginBalance(credentials: BinanceCredentials): Promise<number> {
		const timestamp = new Date().getTime()
		const params = {
			timestamp
		}
		const signature = this.getApiSign(params, credentials)
		const response = await this.client.get('/sapi/v1/margin/isolated/account', {
			headers: {
				'X-MBX-APIKEY': credentials.api_key
			},
			params: {
				...params,
				signature
			}
		})
		let total = 0
		for (const asset of response.data.assets) {
			const baseAmount = Number.parseFloat(asset.baseAsset.netAsset)
			const quoteAsset = Number.parseFloat(asset.quoteAsset.netAsset)
			if (quoteAsset > 0) {
				total += quoteAsset
			}
			if (baseAmount > 0) {
				const converted = await this.getAveragePrice(asset.baseAsset.asset, baseAmount)
				console.log(converted);

				total += converted
			}
		}

		return total
	}

	private async getSavingsBalance(credentials: BinanceCredentials): Promise<number> {
		const timestamp = new Date().getTime()
		const params = {
			timestamp
		}
		const signature = this.getApiSign(params, credentials)
		const response = await this.client.get('/sapi/v1/lending/union/account', {
			headers: {
				'X-MBX-APIKEY': credentials.api_key
			},
			params: {
				...params,
				signature
			}
		})
		let total = 0
		for (const position of response.data.positionAmountVos) {
			total += Number.parseFloat(position.amountInUSDT)
		}

		return total
	}

	private async getSpotBalance(credentials: BinanceCredentials) {
		const timestamp = new Date().getTime()
		const params = {
			timestamp
		}
		const signature = this.getApiSign(params, credentials)
		const response = await this.client.get('/api/v3/account', {
			headers: {
				'X-MBX-APIKEY': credentials.api_key
			},
			params: {
				...params,
				signature
			}
		})
		const balances: { asset: string, free: number, locked: number }[] = response.data.balances.map((balance) => {
			return {
				asset: balance.asset,
				free: Number.parseFloat(balance.free),
				locked: Number.parseFloat(balance.locked)
			}
		}).filter((balance) => {
			return balance.free > 0 || balance.locked > 0
		})

		let total = 0
		for (const balance of balances) {
			const converted = await this.getAveragePrice(balance.asset, balance.free)
			total += converted
		}

		return total
	}

	private async getAveragePrice(symbol: string, amount: number): Promise<number> {
		if (amount === 0) {
			return 0
		}
		if (symbol === 'USDT') {
			return amount
		}
		const response = await this.client.get('/api/v3/avgPrice', {
			validateStatus: (status) => true,
			params: {
				symbol: `${symbol}USDT`
			}
		})
		if (response.data.price) {
			return amount * Number.parseFloat(response.data.price)
		} else {
			return 0
		}
	}

	private getApiSign(query: any, credentials: BinanceCredentials): string {
		const data = qs.stringify(query)
		return crypto.createHmac('sha256', credentials.secret).update(data).digest('hex')
	}

	async setup(accountId: number, data: BinanceSetup) {
		const existing: BinanceCredentials = await BinanceCredentials.findOne({
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
			await BinanceCredentials.create({
				account_id: accountId,
				api_key: data.apiKey,
				secret: data.secret
			})
		}
	}
}

type BinanceSetup = {
	apiKey: string,
	secret: string
}
