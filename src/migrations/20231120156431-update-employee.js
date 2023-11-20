"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Employees", "phone", Sequelize.STRING);
    await queryInterface.addColumn(
      "Employees",
      "dateOfBirth",
      Sequelize.STRING
    );
    await queryInterface.addColumn("Employees", "address", Sequelize.STRING);
    await queryInterface.addColumn("Employees", "gender", Sequelize.BOOLEAN);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Employees", "phone");
    await queryInterface.removeColumn("Employees", "dateOfBirth");
    await queryInterface.removeColumn("Employees", "address");
    await queryInterface.removeColumn("Employees", "gender");
  },
};
