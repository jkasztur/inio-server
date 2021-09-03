import { Container } from 'node-injectable'
import { Sequelize } from 'sequelize/types'
import { Server } from './http'

let container: Container

export async function start() {
	console.log('Server starting')
	container = new Container()
	container.add('container', container)
	// build DI container
	await container.lookup(__dirname + '/**/*.js')

	const server: Server = container.get('http.server')
	await server.listenAsync(Number(process.env.PORT))
	console.log('Server started')
}

export async function stop() {
	console.log('Server stopping')
	const dbClient: Sequelize = container.get('database.client')
	await dbClient.close()
	const server: Server = container.get('http.server')
	await server.shutdownAsync()
	console.log('Server stopped')
}

export function terminate(code: number = 0): void {
	setTimeout(() => {
		process.exit(code)
	}, 1000).unref()
}
