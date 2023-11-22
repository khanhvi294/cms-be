import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";
import examFormsService from "./examFormsService";
import competitionService from "./competitionService";
import ErrorMessage from "../common/errorMessage";

export const findExamFormByName = async (name) => {
  if (!name) {
    throw new HttpException(400, "Missing parameter");
  }

  const examForm = await db.ExamForm.findOne({ where: { name } });
  return examForm;
};

export const getAllRounds = async () => {
  const data = await db.Round.findAll({
    order: [["createdAt", "DESC"]],
  });
  return resFindAll(data);
};

export const getRoundsByCompetition = async (competitionId) => {
  if (!competitionId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }
  const data = await db.Round.findAll({
    where: { competitionId: competitionId },
  });
  return resFindAll(data);
};
export const getRoundsByExamForm = async (examFormId) => {
  if (!examFormId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }
  const data = await db.Round.findAll({
    where: { examFormId: examFormId },
  });
  return resFindAll(data);
};

export const createRound = async (data) => {
  // find competition
  const competitionPromises = competitionService.getCompetitionIncludeRounds(
    data?.competitionId
  );

  // find examForm
  const examFormPromises = examFormsService.getExamFormById(data.examFormId);

  const [competition] = await Promise.all([
    competitionPromises,
    examFormPromises,
  ]);

  // check time start if less than time end competition
  if (new Date(competition.timeEnd) < new Date(data.timeStart)) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM(
        "Time start round must be less than time end of the competition"
      )
    );
  }

  // round tu dong nhap
  // save to db
  const newRound = {
    time: data.time,
    exam: data.exam,
    examFormId: data.examFormId,
    competitionId: data.competitionId,
    roundNumber: competition?.competitionRound.length + 1,
    // roundNumber: data.roundNumber,
    numPoint: data.numPoint,
    timeStart: data.timeStart,
  };

  const roundNew = await db.Round.create(newRound);

  return roundNew;
};

export const getRoundById = async (id) => {
  if (!id) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.Round.findOne({
    where: {
      id: id,
    },
  });

  if (!data) {
    throw new HttpException(400, ErrorMessage.OBJECT_NOT_FOUND("Round"));
  }

  return data;
};
export const updateRound = async () => {};
export const deleteRound = async () => {};

export default {
  getAllRounds,
  createRound,
  getRoundsByCompetition,
  updateRound,
  deleteRound,
  getRoundById,
  getRoundsByExamForm,
};
