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
      });

      Class.belongsTo(models.Employee, {
        foreignKey: "employeeId",
        targetKey: "id",
      });
      Class.hasMany(models.StudentClass, {
        foreignKey: "classId",
      });
      Class.hasMany(models.CompetitionClass, {
        foreignKey: "classId",
      });
    }
  }
  Class.init(
    {
      name: DataTypes.STRING,
      courseId: DataTypes.INTEGER,
      employeeId: DataTypes.INTEGER,
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
