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
      Employee.belongsTo(models.Account, {
        foreignKey: "accountId",
        targetKey: "id",
        as: "accountEmployee",
      });

      Employee.hasMany(models.Competition, {
        foreignKey: "employeeId",
        as: "employeeCompetition",
      });
      Employee.hasMany(models.Judge, {
        foreignKey: "employeeId",
        as: "employeeJudge",
      });
    }
  }
  Employee.init(
    {
      fullName: DataTypes.STRING,
      accountId: DataTypes.INTEGER,
      cccd: DataTypes.STRING,
      phone: DataTypes.STRING,
      dateOfBirth: DataTypes.DATEONLY,
      address: DataTypes.STRING,
      gender: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Employee",
    }
  );
  return Employee;
};
