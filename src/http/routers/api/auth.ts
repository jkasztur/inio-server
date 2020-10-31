import { Context } from "../../types";
import Router from "koa-router";

const db = {}

/**
 * @injectable(http.router.auth)
 */
export function createAuthRouter(): Router {
	const router = new Router({
		prefix: '/auth'
	})

	router.post('/register', (ctx: Context) => {
		const { userName, password } = ctx.request.body
		if (db[userName]) {
			ctx.throw('Username already exists', 400)
		} else {
			db[userName] = password
			ctx.send(200)
		}
	})

	router.post('/login', (ctx: Context) => {
		const { userName, password } = ctx.request.body
		if (db[userName]) {
			ctx.send(200)
			return
		} else {
			ctx.throw(403)
		}
	})

	return router
}