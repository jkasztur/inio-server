
import Joi from "joi";
import Router from "koa-router";
import auth from "../../http/middleware/auth";
import validate from "../../http/middleware/validate";
import { Context } from "../../http/types";
import { AvaxConnector } from "./connector";
/**
 * @injectable(http.router.avax)
 * @param connector @inject(modules.avax.connector)
 */
export function createMainRouter(connector: AvaxConnector): Router {
	const router = new Router({
		prefix: '/avax'
	})
	router.use(auth())

	router.get('/balance', validate({
		query: {
			currency: Joi.string().uppercase().default('CZK')
		}
	}), async (ctx: Context) => {
		const balance = await connector.getBalance(Number.parseInt(ctx.headers['x-account-id'] as string), ctx.query.currency as string)
		ctx.send(balance, 200)
	})

	router.post('/setup', validate({
		body: {
			address: Joi.string().required(),
		}
	}), async (ctx: Context) => {
		await connector.setup(Number.parseInt(ctx.headers['x-account-id'] as string), ctx.request.body)
		ctx.send(null, 200)
	})

	return router
}