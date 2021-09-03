
export interface IConnector {
	getBalance(): Promise<number>
}