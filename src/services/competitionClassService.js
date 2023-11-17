import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import db from "../models";
import { STATUS_COMPETITION } from "../utils/const";
import competitionService from "./competitionService";

const createCompetitionClass = async (data) => {
  const result = await db.CompetitionClass.create({
    competitionId: data.competitionId,
    classId: data.classId,
  });
  return result;
};

const getAllClassCanJoinCompetition = async (competitionId) => {
  const competition =
    await competitionService.getCompetitionById(competitionId);

  if (competition.status !== STATUS_COMPETITION.CREATED) {
    throw new HttpException(400, ErrorMessage.HAS_NO_DATA);
  }

  // check tgian
  const classes = await db.Class.findAll({
    raw: true,
    nest: true,
    include: [
      {
        model: db.Course,
        as: "courseClass",
      },
    ],
    order: [["updatedAt", "DESC"]],
  });

  return classes;
};

const checkClassCanJoinCompetition = async (classObj) => {};

export default {
  createCompetitionClass,
  getAllClassCanJoinCompetition,
  checkClassCanJoinCompetition,
};
