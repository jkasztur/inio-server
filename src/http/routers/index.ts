
import Router from "koa-router";
import { Context } from "../types";

export function createMainRouter(): Router {
	const router = new Router()

	router.get('/status', (ctx: Context) => {
		ctx.send({ ok: true }, 200)
	})

	router.use((ctx: Context) => {
		ctx.throw('Method not implemented', 404)
	})

	return router
}