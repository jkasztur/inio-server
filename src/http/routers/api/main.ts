
import Router from "koa-router";
import { Sequelize } from "sequelize/types";
import { Context } from "../../types";

/**
 * @injectable(http.router.main)
 * @param dbClient @inject(database.client)
 */
export function createMainRouter(dbClient: Sequelize): Router {
	const router = new Router()

	router.get('/status', async (ctx: Context) => {
		let dbStatus: string
		try {
			await dbClient.authenticate()
			dbStatus = 'Database connected successfuly'
		} catch (err) {
			dbStatus = err.message
		}
		ctx.send({ ok: true, db: dbStatus }, 200)
	})

	router.options('/*', (ctx: Context) => {
		ctx.send({ ok: true }, 200)
	})

	router.use((ctx: Context) => {
		ctx.throw('Method not implemented', 404)
	})

	return router
}