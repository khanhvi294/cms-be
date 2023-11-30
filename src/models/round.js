"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Round extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Round.belongsTo(models.Competition, {
        foreignKey: "competitionId",
        targetKey: "id",
        as: "competitionRound",
      });
      Round.belongsTo(models.ExamForm, {
        foreignKey: "examFormId",
        targetKey: "id",
        as: "examFormRound",
      });
      Round.hasMany(models.Score, {
        foreignKey: "roundId",
        as: "scoreRound",
      });
      Round.hasMany(models.RoundResult, {
        foreignKey: "roundId",
        as: "roundResultRound",
      });
      // Round.hasMany(models.StudentRound, {
      //   foreignKey: "roundId",
      //   as: "roundStudentRound",
      // });
      Round.hasMany(models.Judge, {
        foreignKey: "roundId",
        as: "roundJudge",
      });
    }
  }
  Round.init(
    {
      competitionId: DataTypes.INTEGER,
      examFormId: DataTypes.INTEGER,
      exam: DataTypes.STRING,
      time: DataTypes.INTEGER,
      roundNumber: DataTypes.INTEGER,
      scorePoint: DataTypes.INTEGER,
      timeStart: DataTypes.DATEONLY,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Round",
    }
  );
  return Round;
};
