import { createServer, Server } from './http'

let server: Server

export async function start() {
	server = createServer()
	const port = Number(process.env.PORT || 5001)
	await server.listenAsync(port)
}

export async function stop() {
	await server.shutdownAsync()
}

export function terminate(code: number = 0): void {
	setTimeout(() => {
		process.exit(code)
	}, 1000).unref()
}
