import { Sequelize } from "sequelize-typescript";
import { Account } from "./models/Account";

/**
 * @injectable(database.client)
 */
export function createDatabaseClient(): Sequelize {
	const client = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres',
		ssl: true
	})

	client.addModels([Account])
	return client
}
