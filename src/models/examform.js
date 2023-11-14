"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ExamForm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ExamForm.hasMany(models.Round, {
        foreignKey: "examFormId",
        as: "examFormRound",
      });
    }
  }
  ExamForm.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ExamForm",
    }
  );
  return ExamForm;
};
