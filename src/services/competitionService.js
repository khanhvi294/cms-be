import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import db from "../models";
import { STATUS_COMPETITION, resFindAll } from "../utils/const";
import classService from "./classService";
import competitionClassService from "./competitionClassService";
import { sequelize } from "../config/connectDB";
import { checkCompetitionStatus } from "../utils/const";

export const createCompetition = async (employeeId, data) => {
  if (!data?.competitionClass || !data?.competitionClass?.length) {
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

    if (result?.dataValues) {
      return result.dataValues;
    }

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

export const getCompetitionById = async (id) => {
  if (!id) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.Competition.findOne({
    where: {
      id: id,
    },
  });

  if (!data) {
    throw new HttpException(400, ErrorMessage.OBJECT_NOT_FOUND("Competition"));
  }

  return data;
};

export const updateStatusCompetition = async (id, statusId) => {
  const competition = await getCompetitionById(id);
  if (!checkCompetitionStatus(statusId)) {
    throw new HttpException(422, ErrorMessage.DATA_IS_INVALID("Status"));
  }

  const dataUpdate = await db.Competition.update(
    {
      status: statusId,
    },
    { where: { id } }
  );

  if (dataUpdate[0] === 1) {
    return await getCompetitionById(id);
  }

  throw new HttpException(400, ErrorMessage.INTERNAL_ERROR);
};

const addClassToCompetition = async () => {};
const removeClassToCompetition = async () => {};
const updateCompetition = async () => {};

export default {
  createCompetition,
  getAllCompetition,
  getCompetitionById,
  updateStatusCompetition,
  addClassToCompetition,
  removeClassToCompetition,
  updateCompetition,
};
