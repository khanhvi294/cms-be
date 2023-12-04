import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";
import scoreService from "./scoreService";

const createRoundResult = async (data, t) => {
  if (!data.studentId || !data.roundId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  await checkRoundResultExists(data);

  const roundResult = await db.RoundResult.create(
    {
      studentId: data.studentId,
      roundId: data.roundId,
      score: 0,
    },
    { transaction: t }
  );

  return roundResult;
};

const checkRoundResultExists = async (data) => {
  const check = await db.RoundResult.findOne({
    where: { roundId: data.roundId, studentId: data.studentId },
  });
  if (check) {
    throw new HttpException(
      400,
      ErrorMessage.OBJECT_IS_EXISTING("Student's result")
    );
  }

  return false;
};

const findRoundResult = async (id) => {
  if (!id) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const result = await db.RoundResult.findOne({
    where: { id: id },

    nest: true,
    raw: false,
    include: [
      {
        model: db.Score,
        as: "roundResultScore",
      },
    ],
  });
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
   *    score
   *    roundId
   * }
   */

  if (!data.id || !data.judgeId || !data.roundId || !data.score) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  // check does round result is existing;
  // update score -> create new score for this bgk
  await Promise.all([getRoundResult(data.id)]);

  try {
    const result = await db.sequelize.transaction(async (t) => {
      // create score
      await scoreService.createScoreForOneStudent(
        { roundResultId: data.id, judgeId: data.judgeId, score: data.score },
        t
      );
      // update to round result
      const roundResultUpdate = await db.RoundResult.increment(
        {
          score: data.score,
        },
        { where: { id: data.id }, transaction: t }
      ).then(async () => {
        return await findRoundResult(data.id);
      });
      return roundResultUpdate;
    });
    return result;
  } catch (error) {
    console.log("ERROR:: ", error);
    throw new HttpException(400, error.message);
  }
};

const getRoundResultByRound = async (roundId) => {
  if (!roundId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.RoundResult.findAll({
    where: { roundId },
    nest: true,
    raw: false,
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

const updateScore = async (data) => {};

const checkStudentPassRound = async (data) => {
  /**
   * data {
   *
   * }
   */
};
const confirmStudentPassRound = async (data) => {};

export default {
  createRoundResult,
  updateRoundResult,
  findRoundResult,
  getRoundResult,
  getRoundResultByRound,
  updateScore,
  checkStudentPassRound,
  confirmStudentPassRound,
};
