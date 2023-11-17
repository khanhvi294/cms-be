"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Score extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Score.belongsTo(models.StudentRound, {
        foreignKey: "participantRoundId",
        targetKey: "id",
        as: "studentRoundScore",
      });
      Score.belongsTo(models.Judge, {
        foreignKey: "judgeId",
        targetKey: "id",
        as: "scoreJudge",
      });
      // Score.belongsTo(models.Register, {
      //   foreignKey: "participantId",
      //   targetKey: "id",
      //   as: "registerScore",
      // });
    }
  }
  Score.init(
    {
      participantRoundId: DataTypes.INTEGER,
      judgeId: DataTypes.INTEGER,
      // roundId: DataTypes.INTEGER,
      score: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Score",
    }
  );
  return Score;
};
