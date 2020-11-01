import { Context } from "../../types";
import Router from "koa-router";
import { Account } from "../../../database/models/Account";
import * as argon2 from 'argon2';
import validate from "../../middleware/validate";
import Joi from "@hapi/joi";

/**
 * @injectable(http.router.auth)
 */
export function createAuthRouter(): Router {
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
		const existing: Account = await Account.findOne({
			where: {
				userName
			}
		})
		if (existing) {
			ctx.throw('Username already exists', 400)
		}
		const hashedPassword = await argon2.hash(password)
		await Account.create({
			userName, password: hashedPassword
		})
		ctx.send({ ok: true }, 204)
	})

	router.post('/login', validate({
		body: {
			userName: Joi.string().required(),
			password: Joi.string().required()
		}
	}), async (ctx: Context) => {
		const { userName, password } = ctx.request.body
		const account: Account = await Account.findOne({
			where: {
				userName
			}
		})
		if (!account) {
			ctx.send('Account not found', 404)
			return
		}
		const isMatch = await argon2.verify(account.password, password)
		if (isMatch) {
			ctx.send(200)
			return
		} else {
			ctx.throw(403)
		}
	})

	return router
}