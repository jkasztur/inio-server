'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('binance_credentials', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			account_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'accounts',
					key: 'id'
				},
				onUpdate: 'cascade',
				onDelete: 'cascade'
			},
			api_key: {
				type: Sequelize.STRING(100),
				allowNull: false
			},
			secret: {
				type: Sequelize.STRING(100),
				allowNull: false
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
		return queryInterface.dropTable('binance_credentials')
	}
};
