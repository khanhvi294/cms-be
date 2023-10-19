"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Employees extends Model {
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
      fullName: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      cccd: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Employees",
    }
  );
  return Employees;
};
