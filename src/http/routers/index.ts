import { Context } from "koa";
import Router from "koa-router";

export function createMainRouter(): Router {
	const router = new Router()
	router.get('/status', (ctx: Context) => {
		ctx.body = { ok: true }
		ctx.status = 200
	})

	// fallback
	router.all('/*', (ctx: Context) => {
		ctx.status = 404
		ctx.body = 'Requested method not implemented'
	})

	return router
}