"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Judge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Judge.hasMany(models.Score, {
        foreignKey: "judgeId",
        as: "scoreJudge",
      });
      Judge.belongsTo(models.Round, {
        foreignKey: "roundId",
        targetKey: "id",
        as: "roundJudge",
      });
      Judge.belongsTo(models.Employee, {
        foreignKey: "employeeId",
        targetKey: "id",
        as: "employeeJudge",
      });
    }
  }
  Judge.init(
    {
      employeeId: DataTypes.INTEGER,
      roundId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Judge",
    }
  );
  return Judge;
};
