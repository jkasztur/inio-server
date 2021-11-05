import { Model, AllowNull, DataType, AutoIncrement, ForeignKey } from 'sequelize-typescript'
import { Table, Column, PrimaryKey } from 'sequelize-typescript'
import { Address } from './Address'

@Table({
	tableName: 'whitelisted_contract',
})
export class WhitelistedContract extends Model<WhitelistedContract> {

	@AutoIncrement
	@PrimaryKey
	@Column
	id: number

	@ForeignKey(() => Address)
	@Column
	address_id: number

	@AllowNull(false)
	@Column({
		type: DataType.STRING(100)
	})
	contract: string
}
