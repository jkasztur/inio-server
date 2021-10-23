import { Sequelize } from "sequelize-typescript";
import { Account } from "./models/Account";

/**
 * @injectable(database.client)
 */
export function createDatabaseClient(): Sequelize {
	const client = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres',
		dialectOptions: {
			ssl: {
				rejectUnauthorized: false
			}
		}
	})

	client.addModels([Account])
	return client
}
