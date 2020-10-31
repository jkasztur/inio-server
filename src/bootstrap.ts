import { Container } from 'node-injectable'
import { Sequelize } from 'sequelize/types'
import { Server } from './http'

let container: Container

export async function start() {
	container = new Container()
	container.add('container', container)
	// build DI container
	await container.lookup(process.env.TS_NODE_DEV ? __dirname + '/**/*.ts' : __dirname + '/**/*.js')
	const server: Server = container.get('http.server')
	await server.listenAsync(Number(process.env.PORT))
}

export async function stop() {
	const dbClient: Sequelize = container.get('database.client')
	await dbClient.close()
	const server: Server = container.get('http.server')
	await server.shutdownAsync()
}

export function terminate(code: number = 0): void {
	setTimeout(() => {
		process.exit(code)
	}, 1000).unref()
}
