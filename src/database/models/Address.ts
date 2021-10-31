import { Model, AllowNull, DataType, AutoIncrement, ForeignKey } from 'sequelize-typescript'
import { Table, Column, PrimaryKey } from 'sequelize-typescript'
import { Account } from './Account'

@Table({
	tableName: 'address',
})
export class Address extends Model<Address> {

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
	address: string

	@AllowNull(false)
	@Column({
		type: DataType.STRING(20)
	})
	chain: string
}
