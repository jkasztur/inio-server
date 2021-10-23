require('dotenv').config()
module.exports = {
	production: {
		host: process.env.POSTGRES_HOST,
		port: Number.parseInt(process.env.POSTGRES_PORT || '5432'),
		username: process.env.POSTGRES_USERNAME,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		dialect: 'postgres',
		dialectOptions: {
			timezone: 'Etc/UTC',
			ssl: {
				rejectUnauthorized: false
			}
		},
	}
}
