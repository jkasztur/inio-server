require('dotenv').config()
require('source-map-support').install()
const bootstrap = require('../src/bootstrap')

process.on('SIGINT', async () => {
	setTimeout(() => {
		process.exit(1)
	}, 10000).unref()
	await bootstrap.stop()
})

process.on('SIGTERM', async () => {
	setTimeout(() => {
		process.exit(1)
	}, 10000).unref()
	await bootstrap.stop()
})

bootstrap.start().catch((err) => {
	console.error(err)
	bootstrap.terminate(1)
})
