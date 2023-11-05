"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StudentClass.belongsTo(models.Class, {
        foreignKey: "classId",
        targetKey: "id",
      });
      StudentClass.belongsTo(models.Students, {
        foreignKey: "studentId",
        targetKey: "id",
      });

      // define association here
    }
  }
  StudentClass.init(
    {
      studentId: DataTypes.INTEGER,
      classId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "StudentClass",
    }
  );
  return StudentClass;
};
