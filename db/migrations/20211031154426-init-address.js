'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('address', {
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
			address: {
				type: Sequelize.STRING(100),
				allowNull: false
			},
			chain: {
				type: Sequelize.STRING(20),
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
		return queryInterface.dropTable('address')
	}
};
