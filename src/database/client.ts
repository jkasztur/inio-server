import { Sequelize } from "sequelize-typescript";
import { Account } from "./models/Account";

/**
 * @injectable(database.client)
 */
export async function createDatabaseClient(): Promise<Sequelize> {
	const client = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	})

	client.addModels([Account])
	await client.sync()
	return client
}
