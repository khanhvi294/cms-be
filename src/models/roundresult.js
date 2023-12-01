"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoundResult extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RoundResult.belongsTo(models.Round, {
        foreignKey: "roundId",
        targetKey: "id",
        as: "roundResultRound",
      });
      RoundResult.belongsTo(models.Students, {
        foreignKey: "studentId",
        targetKey: "id",
        as: "roundResultStudent",
      });
      RoundResult.hasMany(models.Score, {
        foreignKey: "roundResultId",
        as: "roundResultScore",
      });
    }
  }
  RoundResult.init(
    {
      studentId: DataTypes.INTEGER,
      score: DataTypes.FLOAT,
      numOfJudges: DataTypes.INTEGER,
      roundId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "RoundResult",
    }
  );
  return RoundResult;
};
