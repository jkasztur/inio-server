import Koa from 'koa'
import http from 'http'
import koaBody from 'koa-body'
import Router from 'koa-router'
import cors from './middleware/cors'

/**
 * @injectable(http.koa)
 * @param authRouter @inject(http.router.auth)
 * @param mainRouter @inject(http.router.main)
 */
export function createKoa(authRouter: Router, mainRouter: Router): Koa {
	const app = new Koa<Koa.DefaultState, BaseContext>()
	decorateContext(app.context)
	app.use(koaBody({
		jsonLimit: '10mb',
		onError: (err, ctx) => ctx.throw(400, err),
	}))
	app.use(cors())

	app.use(authRouter.routes())
	app.use(mainRouter.routes())

	return app
}

/**
 * @injectable(http.server)
 * @param koa @inject(http.koa)
 */
export function createServer(koa: Koa): Server {
	const server = new Server(koa.callback())

	return server
}

export class Server extends http.Server {
	async listenAsync(port: number = 5000) {
		return new Promise((resolve, reject) => {
			this.listen(port)
			this.once('listening', () => {
				console.log(`Server listening on port ${port}`)
				resolve()
			})
			this.once('error', (err) => {
				console.log(err)
				reject()
			})
		})
	}

	async shutdownAsync(timeout: number = 100) {
		return new Promise((resolve) => {
			this.close()
			setTimeout(() => {
				resolve()
			}, timeout)
		})
	}
}

export interface BaseContext extends Koa.BaseContext {
	send(data?: any, statusCode?: number): void
}

function decorateContext(context: BaseContext) {
	context.send = function send(data = {}, status = null) {
		this.body = data
		if (status) {
			this.status = status
		}
	}
}
