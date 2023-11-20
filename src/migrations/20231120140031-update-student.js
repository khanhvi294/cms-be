"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Students", "phone", Sequelize.STRING);
    await queryInterface.addColumn(
      "Students",
      "dateOfBirth",
      Sequelize.DATEONLY
    );
    await queryInterface.addColumn("Students", "address", Sequelize.STRING);
    await queryInterface.addColumn("Students", "gender", Sequelize.BOOLEAN);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Students", "phone");
    await queryInterface.removeColumn("Students", "dateOfBirth");
    await queryInterface.removeColumn("Students", "address");
    await queryInterface.removeColumn("Students", "gender");
  },
};
