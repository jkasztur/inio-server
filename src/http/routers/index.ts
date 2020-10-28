import { Context } from "koa";
import Router from "koa-router";

export function createMainRouter(): Router {
	const router = new Router()

	router.get('/status', (ctx: Context) => {
		ctx.body = { ok: true }
		ctx.status = 200
	})

	router.use((ctx: Context) => {
		ctx.body = 'Method not implemented'
		ctx.status = 400
	})

	return router
}