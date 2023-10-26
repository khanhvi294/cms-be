"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Round extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Round.belongsTo(models.Competition);
      Round.hasMany(models.StudentRound);
    }
  }
  Round.init(
    {
      competitionId: DataTypes.INTEGER,
      exam: DataTypes.STRING,
      time: DataTypes.INTEGER,
      roundNumber: DataTypes.INTEGER,
      floorPoint: DataTypes.FLOAT,
      timeStart: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "Round",
    }
  );
  return Round;
};
