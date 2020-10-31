import { Model, AllowNull, DataType, AutoIncrement } from 'sequelize-typescript'
import { Table, Column, PrimaryKey } from 'sequelize-typescript'

@Table
export class Account extends Model<Account> {

	@AutoIncrement
	@PrimaryKey
	@Column
	id: number

	@AllowNull(false)
	@Column({
		type: DataType.STRING(100)
	})
	userName: string

	@AllowNull(false)
	@Column({
		type: DataType.STRING(100)
	})
	password: string

	@AllowNull(true)
	@Column
	createdAt: Date
}
