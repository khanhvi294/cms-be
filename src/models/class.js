"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Class.belongsTo(models.Course, {
        foreignKey: "courseId",
        targetKey: "id",
        as: "courseClass",
      });

      Class.hasMany(models.StudentClass, {
        foreignKey: "classId",
        as: "ClassStudentClass",
      });
      Class.hasMany(models.CompetitionClass, {
        foreignKey: "classId",
        as: "ClassCompetitionClass",
      });
    }
  }
  Class.init(
    {
      name: DataTypes.STRING,
      courseId: DataTypes.INTEGER,
      timeStart: DataTypes.DATEONLY,
      timeEnd: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "Class",
    }
  );
  return Class;
};
