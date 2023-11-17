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

  const data = await db.Competition.findOne({
    where: { id: competitionId },
    raw: true,
    nest: true,
    include: [
      {
        model: db.Round,
        as: "competitionRound",
      },
    ],
    order: [["updatedAt", "DESC"]],
  });
  if (data.competitionRound) {
    return resFindAll(data.competitionRound);
  }

  return resFindAll([]);
};

export const createRound = async (data) => {
  // find competition
  const competitionPromises = competitionService.getCompetitionById(
    data.competitionId
  );

  // find examForm
  const examFormPromises = examFormsService.getExamFormById(data.examFormId);

  await Promise.all([competitionPromises, examFormPromises]);

  // save to db
  const newRound = {
    time: data.time,
    exam: data.exam,
    examFormId: data.examFormId,
    competitionId: data.competitionId,
    roundNumber: data.roundNumber,
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
};
