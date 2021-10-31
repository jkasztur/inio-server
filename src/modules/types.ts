
export interface IConnector<SetupData = object> {
	getBalance(accountId: number, currency: string): Promise<Balance>
	setup(accountId: number, data: SetupData): Promise<void>
}

export type Balance = {
	amount: number,
	currency: string
}