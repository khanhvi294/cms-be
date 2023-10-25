"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Competition_class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Employees.init(
    {
      id: DataTypes.INTEGER,
      competitionId: DataTypes.INTEGER,
      classId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Competition_class",
    }
  );
  return Competition_class;
};
