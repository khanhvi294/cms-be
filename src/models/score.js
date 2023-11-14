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
      // Score.belongsTo(models.StudentRound);
      Score.belongsTo(models.Judge, {
        foreignKey: "judgeId",
        targetKey: "id",
        as: "scoreJudge",
      });
      Score.belongsTo(models.Register, {
        foreignKey: "participantId",
        targetKey: "id",
        as: "registerScore",
      });
    }
  }
  Score.init(
    {
      participantId: DataTypes.INTEGER,
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
