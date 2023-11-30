import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";
import studentService from "./studentService";
import judgeService from "./judgeService";
import roundService from "./roundService";
import roundResultService from "./roundResultService";

export const checkScoreIsExists = async (data) => {
  if (!data.studentId || !data.judgeId || !data.roundId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const result = await db.Score.findOne({
    where: {
      studentId: data.studentId,
      judgeId: data.judgeId,
      roundId: data.roundId,
    },
  });

  if (result) {
    throw new HttpException(
      400,
      ErrorMessage.OBJECT_IS_EXISTING("This student's score")
    );
  }
  return false;
};

export const createScoreOnRound = async (data) => {
  /**
   * data {
   *    roundId, scoreId
   *  [
   *    {studentId, score}
   *  ]
   *
   * }
   */

  // check judge
  const judgePromise = judgeService.getJudgeById(data.judgeId);
  // check round
  const roundPromise = roundService.getRoundById(data.roundId);

  await Promise.all([
    judgePromise,
    roundPromise,
    // scoreExistsPromise,
  ]);
};

export const createScoreByOneJudge = async (data) => {
  /**
   * data {
   *    studentId,
   *    judgeId,
   *    roundId,
   *    score
   * }
   */

  try {
    // check student
    const studentPromise = studentService.getStudentById(data.studentId);
    // check judge
    // const judgePromise = judgeService.getJudgeById(data.judgeId);
    // check round
    // const roundPromise = roundService.getRoundById(data.roundId);
    // check if score is created before
    // const scoreExistsPromise = checkScoreIsExists(data);
    // // check if student is joined this round

    await Promise.all([
      studentPromise,
      // judgePromise,
      // roundPromise,
      // scoreExistsPromise,
    ]);

    await db.sequelize.transaction(async (t) => {
      // create score
      const result = await db.Score.create(
        {
          judgeId: data.judgeId,
          studentId: data.studentId,
          roundId: data.roundId,
          score: data.score,
        },
        { transaction: t }
      );

      // update to totalScore of Round
      const roundResult = await roundResultService.updateRoundResult(
        { studentId: data.studentId, roundId: data.roundId, score: data.score },
        true
      );

      return { result, roundResult };
    });
  } catch (error) {
    console.log("ERROR:: ", error);
    throw new HttpException(400, error?.message || error);
  }
};

export const findScoreById = async (id) => {
  if (!id) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const result = await db.Score.findOne({ where: { id: id } });
  return result;
};

export const getScoreById = async (id) => {
  const result = await findScoreById(id);
  if (!result) {
    throw new HttpException(400, ErrorMessage.OBJECT_NOT_FOUND("Score"));
  }
  return result;
};

export const updateScore = async (data) => {};

export const deleteScore = async (scoreId) => {};

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
  createScoreByOneJudge,
  getScoreByRound,
  getAllScoreByRound,
  updateScore,
  deleteScore,
  findScoreById,
  getScoreById,
  createScoreOnRound,
};
