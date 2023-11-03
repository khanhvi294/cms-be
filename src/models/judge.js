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
      Judge.hasMany(models.Score);
      Judge.belongsTo(models.Round);
      Judge.belongsTo(models.Employee);
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
