import Koa from 'koa'
import http from 'http'
import { createMainRouter } from './routers'

function createKoa(): Koa {
	const app = new Koa()

	app.use(createMainRouter().routes())

	return app
}

export function createServer(): Server {
	const koa = createKoa()
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
