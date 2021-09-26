import { Account } from "../database/models/Account"
import * as argon2 from 'argon2';
import { StringifyOptions } from "querystring";

export class AuthService {
	/**
	 * @injectable(app.authService)
	 */
	constructor() { }

	public async register(userName: string, password: string): Promise<LoginResponse> {
		const existing: Account = await Account.findOne({
			where: {
				userName
			}
		})
		if (existing) {
			return { status: LoginStatus.AlreadyExists }
		}
		const hashedPassword = await argon2.hash(password)
		const account = await Account.create({
			userName, password: hashedPassword
		})
		const accessToken = await this.createAccessToken(account.id)
		return {
			status: LoginStatus.Ok,
			accessToken
		}
	}

	public async login(userName: string, password: string): Promise<LoginResponse> {
		const account: Account = await Account.findOne({
			where: {
				userName
			}
		})
		if (!account) {
			return { status: LoginStatus.NotFound }
		}
		const isValid = await argon2.verify(account.password, password)
		if (isValid) {
			return { status: LoginStatus.InvalidPassword }
		}
		const accessToken = await this.createAccessToken(account.id)
		return {
			status: LoginStatus.Ok,
			accessToken
		}
	}

	private async createAccessToken(accountId: number): Promise<string> {
		return 'access-token'
	}
}

type LoginResponse = {
	status: LoginStatus,
	accessToken?: string
}

export enum LoginStatus {
	Ok,
	NotFound,
	InvalidPassword,
	AlreadyExists
}