import { Context } from "../types"
import HttpStatus from 'http-status-codes'

export default () => {

	return async function auth(ctx: Context, next: () => any) {
		const accessToken = ctx.headers['x-access-token']
		if (!accessToken) {
			ctx.throw('No access token', HttpStatus.UNAUTHORIZED)
		}
		const accountId = ctx.headers['x-account-id']
		if (!accountId) {
			ctx.throw('No acocunt id', HttpStatus.UNAUTHORIZED)
		}
		// TODO: validate access token
		await next()
	}
}