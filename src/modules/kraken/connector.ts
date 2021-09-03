import { IConnector } from "../types";

export class KrakenConnector implements IConnector {

	/**
	   * @injectable(modules.kraken.connector)
	   */
	constructor() {

	}

	getBalance() {
		return Promise.resolve(2)
	}
}