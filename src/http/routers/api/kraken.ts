
import Router from "koa-router";
import { IConnector } from "../../../modules/types";
import auth from "../../middleware/auth";
import { Context } from "../../types";

/**
 * @injectable(http.router.kraken)
 * @param connector @inject(modules.kraken.connector)
 */
export function createMainRouter(connector: IConnector): Router {
	const router = new Router({
		prefix: '/kraken'
	})
	router.use(auth())

	router.get('/balance', async (ctx: Context) => {
		const balance = await connector.getBalance()
		ctx.send(balance, 200)
	})

	return router
}