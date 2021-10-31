
import Joi from "joi";
import Router from "koa-router";
import { IConnector } from "../types";
import auth from "../../http/middleware/auth";
import validate from "../../http/middleware/validate";
import { Context } from "../../http/types";

/**
 * @injectable(http.router.kraken)
 * @param connector @inject(modules.kraken.connector)
 */
export function createMainRouter(connector: IConnector): Router {
	const router = new Router({
		prefix: '/kraken'
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
			apiKey: Joi.string().required(),
			secret: Joi.string().required()
		}
	}), async (ctx: Context) => {
		await connector.setup(Number.parseInt(ctx.headers['x-account-id'] as string), ctx.request.body)
		ctx.send(null, 200)
	})

	return router
}