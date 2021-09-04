import axios from "axios";

/**
 * @injectable(clients.kraken)
 */
export function createAxtionClient() {
	return axios.create({
		baseURL: 'https://api.kraken.com'
	})
}