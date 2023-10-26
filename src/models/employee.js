"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Employee.belongsTo(models.Account);
      Employee.hasMany(models.Competition);
    }
  }
  Employee.init(
    {
      id: DataTypes.INTEGER,
      fullName: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      cccd: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Employee",
    }
  );
  return Employee;
};
