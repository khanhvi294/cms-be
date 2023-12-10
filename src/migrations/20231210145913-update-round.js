'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Rounds', 'approved', Sequelize.BOOLEAN);
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('Rounds', 'approved');
	},
};
