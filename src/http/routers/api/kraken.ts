
import Router from "koa-router";
import { IConnector } from "../../../modules/types";
import { Context } from "../../types";

/**
 * @injectable(http.router.kraken)
 * @param connector @inject(modules.kraken.connector)
 */
export function createMainRouter(connector: IConnector): Router {
	const router = new Router({
		prefix: '/kraken'
	})

	router.get('/balance', async (ctx: Context) => {
		const balance = await connector.getBalance()
		ctx.send({ balance }, 200)
	})

	router.use((ctx: Context) => {
		ctx.throw('Method not implemented', 404)
	})

	return router
}