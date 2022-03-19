
import Joi from "joi";
import Router from "koa-router";
import auth from "../../http/middleware/auth";
import validate from "../../http/middleware/validate";
import { Context } from "../../http/types";
import { BscConnector } from "./connector";
/**
 * @injectable(http.router.bsc)
 * @param connector @inject(modules.bsc.connector)
 */
export function createMainRouter(connector: BscConnector): Router {
	const router = new Router({
		prefix: '/bsc'
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

	router.post('/whitelist', validate({
		body: {
			address: Joi.string().required()
		}
	}), async (ctx: Context) => {
		await connector.whitelist(Number.parseInt(ctx.headers['x-account-id'] as string), ctx.request.body)
		ctx.send(null, 200)
	})

	router.delete('/whitelist/:address', validate({
		params: {
			address: Joi.string().required()
		}
	}), async (ctx: Context) => {
		await connector.removeWhitelisted(Number.parseInt(ctx.headers['x-account-id'] as string), ctx.params.address)
		ctx.send(null, 200)
	})

	router.get('/whitelist', async (ctx: Context) => {
		const addresses: string[] = await connector.getWhitelisted(Number.parseInt(ctx.headers['x-account-id'] as string))
		ctx.send({ addresses }, 200)
	})

	return router
}