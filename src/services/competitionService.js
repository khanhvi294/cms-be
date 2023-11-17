import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import db from "../models";
import { STATUS_COMPETITION, resFindAll } from "../utils/const";
import classService from "./classService";
import competitionClassService from "./competitionClassService";
import { sequelize } from "../config/connectDB";

export const createCompetition = async (employeeId, data) => {
  if (!data.competitionClass) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  try {
    const result = await sequelize.transaction(async (t) => {
      const competitionData = {
        name: data.name,
        status: STATUS_COMPETITION.CREATED,
        employeeId: employeeId,
        maximumQuantity: data.maximumQuantity,
        minimumQuantity: data.minimumQuantity,
        numOfPrizes: data.numOfPrizes,
        numberOfRound: data.numberOfRound,
        timeStart: data.timeStart,
        timeEnd: data.timeEnd,
      };

      const competition = await db.Competition.create(competitionData, {
        transaction: t,
      });

      const competitionClassPromise = await data.competitionClass.map(
        async (item) => {
          await classService.getClassById(item);
          return competitionClassService.createCompetitionClass({
            competitionId: competition.id,
            classId: item,
          });
        }
      );

      const result = await Promise.all[competitionClassPromise];

      return { ...competition, competitionClass: result };
    });

    return result;
    // If the execution reaches this line, the transaction has been committed successfully
    // `result` is whatever was returned from the transaction callback (the `user`, in this case)
  } catch (error) {
    console.log("ERROR:: ", error);
    // If the execution reaches this line, an error occurred.
    // The transaction has already been rolled back automatically by Sequelize!
  }

  return result;
};

export const getAllCompetition = async () => {
  const data = await db.Competition.findAll({ order: [["createdAt", "DESC"]] });
  return resFindAll(data);
};

export default {
  createCompetition,
  getAllCompetition,
};
