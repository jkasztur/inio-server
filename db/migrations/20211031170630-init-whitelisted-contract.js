'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('whitelisted_contract', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			address_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'address',
					key: 'id'
				},
				onUpdate: 'cascade',
				onDelete: 'cascade'
			},
			contract: {
				type: Sequelize.STRING(100),
				allowNull: false,
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		})
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.dropTable('whitelisted_contract')
	}
};
