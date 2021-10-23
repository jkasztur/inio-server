import { Model, AllowNull, DataType, AutoIncrement } from 'sequelize-typescript'
import { Table, Column, PrimaryKey } from 'sequelize-typescript'

@Table({
	tableName: 'accounts',
})
export class Account extends Model<Account> {

	@AutoIncrement
	@PrimaryKey
	@Column
	id: number

	@AllowNull(false)
	@Column({
		type: DataType.STRING(100)
	})
	username: string

	@AllowNull(false)
	@Column({
		type: DataType.STRING(100)
	})
	password: string
}
