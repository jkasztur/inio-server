import { AxiosInstance } from "axios";

export class BinanceService {
	/**
	   * @injectable(modules.binance.service)
	   * @param client @inject(modules.binance.client)
	   */
	constructor(private client: AxiosInstance) {
	}

	async getAveragePrice(symbol: string, amount: number): Promise<number> {
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
}