import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";
import examFormsService from "./examFormsService";
import competitionService from "./competitionService";

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

export const getRoundsByCompetition = async (competitionId) => {};

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

export const updateRound = async () => {};
export const deleteRound = async () => {};

export default {
  getAllRounds,
  createRound,
  getRoundsByCompetition,
  updateRound,
  deleteRound,
};
