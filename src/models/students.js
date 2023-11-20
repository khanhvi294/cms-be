"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Students extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Students.belongsTo(models.Account, {
        foreignKey: "accountId",
        targetKey: "id",
        as: "accountStudent",
      });

      Students.hasMany(models.StudentClass, {
        foreignKey: "studentId",
        as: "ClassStudentStudent",
      });

      Students.hasMany(models.Register, {
        foreignKey: "studentId",
        as: "studentRegister",
      });

      Students.hasMany(models.Score, {
        foreignKey: "studentId",
        as: "scoreStudent",
      });
      // Students.hasMany(models.StudentRound, {
      //   foreignKey: "studentId",
      //   as: "studentStudentRound",
      // });
    }
  }
  Students.init(
    {
      fullName: DataTypes.STRING,
      accountId: DataTypes.INTEGER,
      phone: DataTypes.STRING,
      dateOfBirth: DataTypes.STRING,
      address: DataTypes.STRING,
      gender: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Students",
    }
  );
  return Students;
};
