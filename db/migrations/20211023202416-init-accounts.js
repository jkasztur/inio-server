'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('accounts', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			username: {
				type: Sequelize.STRING(100),
				allowNull: false
			},
			password: {
				type: Sequelize.STRING(100),
				allowNull: false
			},
			platform: {
				type: Sequelize.STRING(16),
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
		return queryInterface.dropTable('accounts')
	}
};
