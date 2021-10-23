
import Router from "koa-router";
import { Sequelize } from "sequelize";
import { Context } from "../../types";
import HttpStatus from 'http-status-codes'

/**
 * @injectable(http.router.main)
 * @param sequelize @inject(database.client)
 */
export function createMainRouter(sequelize: Sequelize): Router {
	const router = new Router()

	router.get('/status', async (ctx: Context) => {
		const dbStatus: number = await check(
			() => sequelize.authenticate(),
			(err) => console.log({ err }, 'Error when connecting to DB')
		)
		ctx.send({ ok: true, db: dbStatus }, 200)
	})

	return router
}

async function check(callback: () => any, onError?: (err: Error) => void, timeout = 5000): Promise<number> {
	const promise = new Promise<void>((resolve, reject) => {
		callback().then(resolve).catch(reject)

		setTimeout(() => {
			reject(new Error('Connection timeout'))
		}, timeout)
	})
	try {
		await promise
		return HttpStatus.OK
	} catch (err) {
		if (onError) {
			onError(err)
		}
		return HttpStatus.SERVICE_UNAVAILABLE
	}
}