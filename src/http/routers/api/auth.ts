import { Context } from "../../types";
import Router from "koa-router";
import validate from "../../middleware/validate";
import Joi from "joi";
import { AuthService, LoginStatus } from "../../../app/authService";

/**
 * @injectable(http.router.auth)
 * @param authService @inject(app.authService)
 */
export function createAuthRouter(authService: AuthService): Router {
	const router = new Router({
		prefix: '/auth'
	})

	router.post('/register', validate({
		body: {
			userName: Joi.string().required(),
			password: Joi.string().required()
		}
	}), async (ctx: Context) => {
		const { userName, password } = ctx.request.body
		const result = await authService.register(userName, password)
		if (result.status === LoginStatus.AlreadyExists) {
			ctx.throw('Username already exists', 409)
		}
		ctx.cookies.set('accessToken', result.accessToken)
		ctx.send(null, 204)
	})

	router.post('/login', validate({
		body: {
			userName: Joi.string().required(),
			password: Joi.string().required()
		}
	}), async (ctx: Context) => {
		const { userName, password } = ctx.request.body
		const result = await authService.login(userName, password)

		if (result.status === LoginStatus.NotFound) {
			ctx.throw('Account not found', 404)
		}
		if (result.status === LoginStatus.InvalidPassword) {
			ctx.throw('Invalid password', 403)
		}
		ctx.cookies.set('accessToken', result.accessToken)
		ctx.send(null, 204)
	})

	return router
}