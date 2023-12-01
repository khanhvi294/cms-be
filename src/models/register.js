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
      Register.belongsTo(models.Students, {
        foreignKey: "studentId",
        targetKey: "id",
        as: "studentRegister",
      });
      Register.belongsTo(models.Competition, {
        foreignKey: "competitionId",
        targetKey: "id",
        as: "competitionRegister",
      });
      // Register.hasMany(models.Score, {
      //   foreignKey: "participantId",
      //   as: "registerScore",
      // });
      // Register.hasMany(models.Score, {
      //   foreignKey: "participantId",
      // });
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
