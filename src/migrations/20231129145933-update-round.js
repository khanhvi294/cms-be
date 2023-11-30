"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Rounds", "numPoint");

    await queryInterface.addColumn("Rounds", "scorePoint", Sequelize.INTEGER, {
      allowNull: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Rounds", "numPoint", Sequelize.INTEGER);
    await queryInterface.removeColumn("Rounds", "scorePoint");
  },
};
