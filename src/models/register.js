"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Register extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Register.belongsTo(models.Students);
      Register.belongsTo(models.Competition);
    }
  }
  Register.init(
    {
      studentId: DataTypes.INTEGER,
      competitionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Register",
    }
  );
  return Register;
};
