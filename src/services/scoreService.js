import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";

export const createScore = async (data) => {};

export const getScoreByRound = async (roundId) => {};

export const getAllScoreByRound = async (roundId) => {
  if (!roundId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.Judge.findAll({
    where: { roundId: roundId },
  });

  return resFindAll(data);
};

export default {
  createScore,
  getScoreByRound,
  getAllScoreByRound,
};
