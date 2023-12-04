import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";
import judgeService from "./judgeService";

const createScoreForOneStudent = async (data, t) => {
  if (!data.roundResultId || !data.judgeId || !data.score) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  await checkScoreIsExists({
    roundResultId: data.roundResultId,
    judgeId: data.judgeId,
  });

  await judgeService.getJudgeById(data.judgeId);

  const score = await db.Score.create(
    {
      roundResultId: data.roundResultId,
      score: data.score,
      judgeId: data.judgeId,
    },
    { transaction: t }
  );

  return score;
};

const updateScoreForOneStudent = async (data, t) => {
  if (!data.roundResultId || !data.judgeId || !data.score) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  await judgeService.getJudgeById(data.judgeId);

  const oldScore = await db.Score.findOne({
    where: { roundResultId: data.roundResultId, judgeId: data.judgeId },
  });

  await db.Score.update(
    {
      score: data.score,
    },
    {
      where: { roundResultId: data.roundResultId, judgeId: data.judgeId },
      transaction: t,
    }
  );

  return oldScore?.score;
};

const checkScoreIsExists = async (data) => {
  if (!data.roundResultId || !data.judgeId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const result = await db.Score.findOne({
    where: { roundResultId: data.roundResultId, judgeId: data.judgeId },
  });

  if (result) {
    throw new HttpException(
      400,
      ErrorMessage.OBJECT_IS_EXISTING("Score is existing")
    );
  }

  return false;
};

const getScoreByRoundResult = async (roundResultId) => {
  if (!roundResultId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const scores = await db.Score.findAll({
    where: { roundResultId },
    // nest: true,
    // raw: false,

    // include: [
    //   {
    //     model: db.Competition,
    //     as: "competitionRound",
    //   },
    // ],
  });
  return resFindAll(scores);
};

export default {
  createScoreForOneStudent,
  getScoreByRoundResult,
  checkScoreIsExists,
  updateScoreForOneStudent,
};
