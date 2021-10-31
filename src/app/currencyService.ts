import axios, { AxiosInstance } from "axios";

export class CurrencyService {
	private client: AxiosInstance

	/**
	   * @injectable(app.currencyService)
	   */
	constructor() {
		this.client = axios.create({
			baseURL: `https://v1.nocodeapi.com/${process.env.CURRENCY_KEY}`,
		})
	}

	async convert(amount: number, from: string, to: string): Promise<number> {
		const response = await this.client.get('/rates/convert', {
			params: {
				amount, from, to
			}
		})

		return parseFloat(response.data.result.toFixed(2))
	}
}