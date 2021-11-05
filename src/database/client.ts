import { Sequelize } from "sequelize-typescript";
import { Account } from "./models/Account";
import { Address } from "./models/Address";
import { BinanceCredentials } from "./models/BinanceCredentials";
import { KrakenCredentials } from "./models/KrakenCredentials";
import { WhitelistedContract } from "./models/WhitelistedContract";

/**
 * @injectable(database.client)
 */
export function createDatabaseClient(): Sequelize {
	const client = new Sequelize({
		host: process.env.POSTGRES_HOST,
		username: process.env.POSTGRES_USERNAME,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		dialect: 'postgres',
		define: {
			charset: 'utf8',
			collate: 'utf8_unicode_ci',
			freezeTableName: true,
		},
		dialectOptions: {
			timezone: 'Etc/UTC',
			ssl: {
				rejectUnauthorized: false
			}
		}
	})

	client.addModels([
		Account,
		KrakenCredentials,
		BinanceCredentials,
		Address,
		WhitelistedContract
	])
	return client
}
