
export interface IConnector {
	getBalance(): Promise<Balance>
}

export type Balance = {
	amount: number,
	currency: string
}