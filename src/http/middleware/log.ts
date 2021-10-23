import { Context } from "../types"
import HttpStatus from 'http-status-codes'

export default () => {

	return async function log(ctx: Context, next: () => any) {
		console.log(`${ctx.method} ${ctx.url}`)

		await next()
	}
}