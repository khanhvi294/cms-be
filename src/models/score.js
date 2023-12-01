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
      Score.belongsTo(models.RoundResult, {
        foreignKey: "roundResultId",
        targetKey: "id",
        as: "roundResultScore",
      });
      // Score.belongsTo(models.Round, {
      //   foreignKey: "roundId",
      //   targetKey: "id",
      //   as: "scoreRound",
      // });
      Score.belongsTo(models.Judge, {
        foreignKey: "judgeId",
        targetKey: "id",
        as: "scoreJudge",
      });
      // Score.belongsTo(models.Students, {
      //   foreignKey: "studentId",
      //   targetKey: "id",
      //   as: "scoreStudent",
      // });
      // Score.belongsTo(models.Register, {
      //   foreignKey: "participantId",
      //   targetKey: "id",
      //   as: "registerScore",
      // });
    }
  }
  Score.init(
    {
      // participantRoundId: DataTypes.INTEGER,
      judgeId: DataTypes.INTEGER,
      roundResultId: DataTypes.INTEGER,
      score: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Score",
    }
  );
  return Score;
};
