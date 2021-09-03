
import Router from "koa-router";
import { Context } from "../../types";

/**
 * @injectable(http.router.main)
 */
export function createMainRouter(): Router {
	const router = new Router()

	router.get('/status', async (ctx: Context) => {
		let dbStatus: string
		try {
			dbStatus = 'Database connected successfuly'
		} catch (err) {
			dbStatus = err.message
		}
		ctx.send({ ok: true, db: dbStatus }, 200)
	})

	router.use((ctx: Context) => {
		ctx.throw('Method not implemented', 404)
	})

	return router
}