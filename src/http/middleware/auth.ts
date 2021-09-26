import { Context } from "../types"
import HttpStatus from 'http-status-codes'

export default () => {

	return async function auth(ctx: Context, next: () => any) {
		const accessToken = ctx.cookies.get('accessToken')
		if (!accessToken) {
			ctx.throw('No access token', HttpStatus.UNAUTHORIZED)
		}
		// TODO: validate access token
		await next()
	}
}