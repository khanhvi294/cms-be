"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Scores", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      judgeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Judges",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      participantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Registers",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      roundId: {
        type: Sequelize.INTEGER,
      },
      score: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable("Scores");
  },
};
