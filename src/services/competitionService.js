import HttpException from "../errors/httpException";
import db from "../models";
import { STATUS_COMPETITION, resFindAll } from "../utils/const";

export const createCompetition = async (employeeId, data) => {
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

  return await db.Competition.create(competitionData);
};

export const getAllCompetition = async () => {
  const data = await db.Competition.findAll({ order: [["createdAt", "DESC"]] });
  return resFindAll(data);
};

export default {
  createCompetition,
  getAllCompetition,
};
