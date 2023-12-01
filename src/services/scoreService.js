import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";

const createScoreForOneStudent = async (data) => {};

const checkScoreIsExists = async (data) => {
  if (!data.roundResultId || !data.judgeId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const result = await db.Score.findOne({
    where: { roundResultId: data.roundResultId, judgeId: data.judgeId },
  });

  if (result) {
    throw new HttpException(400, ErrorMessage.SCORE_IS_INVALID);
  }

  return false;
};

export default {
  createScoreForOneStudent,
  checkScoreIsExists,
};
