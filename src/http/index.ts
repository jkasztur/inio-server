import Koa from 'koa'
import http from 'http'
import koaBody from 'koa-body'
import Router from 'koa-router'
import cors from '@koa/cors'
import log from './middleware/log'

/**
 * @injectable(http.koa)
 * @param main @inject(http.router.main)
 * @param auth @inject(http.router.auth)
 * @param kraken @inject(http.router.kraken)
 * @param binance @inject(http.router.binance)
 * @param eth @inject(http.router.eth)
 * @param bsc @inject(http.router.bsc)
 * @param fallback @inject(http.router.fallback)
 */
export function createKoa(main: Router, auth: Router, kraken: Router, binance: Router, eth: Router, bsc: Router, fallback: Router): Koa {
	const app = new Koa<Koa.DefaultState, BaseContext>()
	decorateContext(app.context)
	app.use(log())
	app.use(cors({
		origin: (ctx) => ctx.get('origin'),
		credentials: true,
		allowHeaders: ['X-Request, X-Requested-With, Content-Type, Cookie, Authorization', 'x-access-token', 'x-account-id']
	}))
	app.use(koaBody({
		jsonLimit: '10mb',
		onError: (err, ctx) => ctx.throw(400, err),
	}))

	app.use(main.routes())
	app.use(auth.routes())
	app.use(kraken.routes())
	app.use(binance.routes())
	app.use(eth.routes())
	app.use(bsc.routes())

	app.use(fallback.routes())

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
		return new Promise<void>((resolve, reject) => {
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
		return new Promise<void>((resolve) => {
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
