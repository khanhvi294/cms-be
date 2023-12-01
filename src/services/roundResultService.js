import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";
import scoreService from "./scoreService";

const createRoundResult = async (data) => {};

const findRoundResult = async (id) => {
  if (!id) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const result = await db.RoundResult.findOne({ id: id });
  return result;
};

const getRoundResult = async (id) => {
  const result = await findRoundResult(id);
  if (!result) {
    throw new HttpException(
      400,
      ErrorMessage.OBJECT_IS_NOT_EXISTING("Student's result")
    );
  }
  return result;
};

export const updateRoundResult = async (data, isNew = true) => {
  /**
   *  data {
   *    id
   *    judgeId,
   *    studentId
   *    score
   *    roundId
   * }
   */

  if (
    !data.id ||
    !data.judgeId ||
    !data.studentId ||
    !data.roundId ||
    !data.score
  ) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  // check does round result is existing;
  // update score -> create new score for this bgk
  await Promise.all([getRoundResult(data.id)]);

  try {
    const result = await db.sequelize.transaction(async (t) => {
      // create score
      // update to round result
    });
  } catch (error) {
    console.log("ERROR:: ", error);
    throw new HttpException(400, error);
  }
};

const getRoundResultByRound = async (roundId) => {
  if (!roundId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.RoundResult.findAll({
    where: { roundId },
    raw: true,
    nest: true,
    attributes: { exclude: ["studentId"] },
    include: [
      {
        model: db.Students,
        as: "roundResultStudent",
        attributes: ["fullName", "id"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  return resFindAll(data);
};

export default {
  createRoundResult,
  updateRoundResult,
  findRoundResult,
  getRoundResult,
  getRoundResultByRound,
};
