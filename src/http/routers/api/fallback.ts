import HttpStatus from 'http-status-codes'
import Router from 'koa-router'
import { Context } from "../../types";

/**
 * @injectable(http.router.fallback)
 */
export function createRouter() {
	const router = new Router()

	router.all('/(.*)', (ctx: Context) => {
		ctx.send({
			code: 'not_implemented',
			message: 'Requested method not implemented',
		}, HttpStatus.BAD_REQUEST)
	})

	return router
}
