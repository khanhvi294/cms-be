'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Competition extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Competition.hasMany(models.Register, {
				foreignKey: 'competitionId',
				as: 'competitionRegister',
			});
			Competition.hasMany(models.CompetitionClass, {
				foreignKey: 'competitionId',
				as: 'competitionCompetitionClass',
			});
			Competition.hasMany(models.Round, {
				foreignKey: 'competitionId',
				as: 'competitionRound',
			});
			Competition.belongsTo(models.Employee, {
				foreignKey: 'employeeId',
				targetKey: 'id',
				as: 'employeeCompetition',
			});
		}
	}
	Competition.init(
		{
			name: DataTypes.STRING,
			status: DataTypes.INTEGER,
			employeeId: DataTypes.INTEGER,
			// courseId: DataTypes.INTEGER,
			minimumQuantity: DataTypes.INTEGER,
			numOfPrizes: DataTypes.INTEGER,
			numberOfRound: DataTypes.INTEGER,
			timeStart: DataTypes.DATEONLY,
			timeEnd: DataTypes.DATEONLY,
		},
		{
			sequelize,
			modelName: 'Competition',
		},
	);
	return Competition;
};
