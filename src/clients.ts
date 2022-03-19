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

/**
 * @injectable(modules.eth.client)
 */
export function createEthClient() {
	return axios.create({
		baseURL: 'https://api.etherscan.io/api'
	})
}

/**
 * @injectable(clients.coingecko)
 */
export function createCoingeckoClient() {
	return axios.create({
		baseURL: 'https://api.coingecko.com/api'
	})
}

/**
 * @injectable(modules.bsc.client)
 */
export function createBscClient() {
	return axios.create({
		baseURL: 'https://api.bscscan.com/api'
	})
}

/**
 * @injectable(modules.avax.client)
 */
export function createAvaxClient() {
	return axios.create({
		baseURL: 'https://api.avax.network'
	})
}