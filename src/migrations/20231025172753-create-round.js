"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Rounds", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      competitionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Competitions",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      examFormId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ExamForms",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      exam: {
        type: Sequelize.STRING,
      },
      time: {
        type: Sequelize.INTEGER,
      },
      roundNumber: {
        type: Sequelize.INTEGER,
      },
      numPoint: {
        type: Sequelize.INTEGER,
      },
      timeStart: {
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
    await queryInterface.dropTable("Rounds");
  },
};
