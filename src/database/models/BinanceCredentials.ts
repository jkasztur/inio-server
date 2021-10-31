import { Model, AllowNull, DataType, AutoIncrement, ForeignKey } from 'sequelize-typescript'
import { Table, Column, PrimaryKey } from 'sequelize-typescript'
import { Account } from './Account'

@Table({
	tableName: 'binance_credentials',
})
export class BinanceCredentials extends Model<BinanceCredentials> {

	@AutoIncrement
	@PrimaryKey
	@Column
	id: number

	@ForeignKey(() => Account)
	@Column
	account_id: number

	@AllowNull(false)
	@Column({
		type: DataType.STRING(100)
	})
	api_key: string

	@AllowNull(false)
	@Column({
		type: DataType.STRING(100)
	})
	secret: string
}
