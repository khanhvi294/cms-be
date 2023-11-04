"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CompetitionClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CompetitionClass.belongsTo(models.Class, {
        foreignKey: "classId",
        targetKey: "id",
      });
      CompetitionClass.belongsTo(models.Competition, {
        foreignKey: "competitionId",
        targetKey: "id",
      });
    }
  }
  CompetitionClass.init(
    {
      competitionId: DataTypes.INTEGER,
      classId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CompetitionClass",
    }
  );
  return CompetitionClass;
};
