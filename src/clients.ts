import axios from "axios";

/**
 * @injectable(clients.kraken)
 */
export function createKrakenClient() {
	return axios.create({
		baseURL: 'https://api.kraken.com'
	})
}

/**
 * @injectable(modules.binance.client)
 */
export function createBinanceClient() {
	return axios.create({
		baseURL: 'https://api1.binance.com'
	})
}