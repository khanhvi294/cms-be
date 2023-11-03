"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentRound extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StudentRound.belongsTo(models.Round);
      StudentRound.belongsTo(models.Student);
      StudentRound.hasMany(models.Score);
    }
  }
  StudentRound.init(
    {
      studentId: DataTypes.INTEGER,
      roundId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "StudentRound",
    }
  );
  return StudentRound;
};
