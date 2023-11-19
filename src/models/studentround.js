"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentRound extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // tam thoi bo qua bang nay
    static associate(models) {
      // define association here
      // StudentRound.belongsTo(models.Round, {
      //   foreignKey: "roundId",
      //   targetKey: "id",
      //   as: "roundStudentRound",
      // });
      // StudentRound.belongsTo(models.Students, {
      //   foreignKey: "studentId",
      //   targetKey: "id",
      //   as: "studentStudentRound",
      // });
      // StudentRound.hasMany(models.Score, {
      //   foreignKey: "participantRoundId",
      //   as: "scoreStudentRound",
      // });
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
