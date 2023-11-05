"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Competitions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.INTEGER,
      },
      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Employees",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      // courseId: {
      //   type: Sequelize.INTEGER,
      // },
      maximumQuantity: {
        type: Sequelize.INTEGER,
      },
      minimumQuantity: {
        type: Sequelize.INTEGER,
      },
      numOfPrizes: {
        type: Sequelize.INTEGER,
      },
      numberOfRound: {
        type: Sequelize.INTEGER,
      },
      timeStart: {
        type: Sequelize.DATEONLY,
      },
      timeEnd: {
        type: Sequelize.DATEONLY,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Competitions");
  },
};
