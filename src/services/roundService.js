import HttpException from "../errors/httpException";
import db from "../models";
import { STATUS_COMPETITION, resFindAll } from "../utils/const";
import examFormsService from "./examFormsService";
import competitionService from "./competitionService";
import ErrorMessage from "../common/errorMessage";
import judgeService from "./judgeService";
import scoreService from "./scoreService";

export const findExamFormByName = async (name) => {
  if (!name) {
    throw new HttpException(400, "Missing parameter");
  }

  const examForm = await db.ExamForm.findOne({ where: { name } });
  return examForm;
};

const findRoundById = async (id) => {
  const round = await db.Round.findOne({ where: { id: id } });
  return round;
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
    raw: true,
    nest: true,
    attributes: { exclude: ["examFormId"] },
    include: [
      {
        model: db.ExamForm,
        as: "examFormRound",
        attributes: ["name", "id"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  return resFindAll(data);
};
export const getRoundsByExamForm = async (examFormId) => {
  if (!examFormId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }
  const data = await db.Round.findAll({
    where: { examFormId: examFormId },
    order: [["createdAt", "DESC"]],
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

  // check status competition cannot be canceled or ended
  if (
    competition.status === STATUS_COMPETITION.CANCEL ||
    competition.status === STATUS_COMPETITION.ENDED
  ) {
    throw new HttpException(400, ErrorMessage.COMPETITION_CANNOT_ADD_ROUND);
  }

  // check if competition is max round
  if (
    competition?.competitionRound &&
    competition?.competitionRound.length == competition.numberOfRound
  ) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM("This competition is max round")
    );
  }

  // check time start if less than time end competition
  if (new Date(competition.timeEnd) < new Date(data.timeStart)) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM(
        "Time start round must be less than time end of the competition"
      )
    );
  }

  if (new Date(competition.timeStart) > new Date(data.timeStart)) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM(
        "Time start round must be greater than time start of the competition"
      )
    );
  }

  if (new Date() >= new Date(data.timeStart)) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM("Time start round must be greater than today")
    );
  }

  // round tu dong nhap
  // save to db
  const newRound = {
    time: data.time,
    exam: data.exam,
    examFormId: data.examFormId,
    name: data.name,
    competitionId: data.competitionId,
    roundNumber: competition?.competitionRound.length + 1,
    // roundNumber: data.roundNumber,
    // numPoint: data.numPoint,
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

export const updateRound = async (round) => {
  const haveRoundPromise = getRoundById(round.id);
  const competitionPromise = competitionService.getCompetitionIncludeRounds(
    round.competitionId
  );

  const [haveRound, competition] = await Promise.all([
    haveRoundPromise,
    competitionPromise,
  ]);

  // check status competition cannot be canceled or ended
  if (
    competition.status === STATUS_COMPETITION.CANCEL ||
    competition.status === STATUS_COMPETITION.ENDED
  ) {
    throw new HttpException(400, ErrorMessage.COMPETITION_CANNOT_UPDATE_ROUND);
  }

  if (new Date(haveRound.timeStart) <= new Date()) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM("Round is already started,can't update")
    );
  }

  if (new Date(competition.timeEnd) < new Date(round.timeStart)) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM(
        "Time start round must be less than time end of the competition"
      )
    );
  }

  if (new Date(competition.timeStart) > new Date(round.timeStart)) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM(
        "Time start round must be greater than time start of the competition"
      )
    );
  }

  if (new Date() >= new Date(round.timeStart)) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM("Time start round must be greater than today")
    );
  }

  const result = await db.Round.update(
    { ...round },
    { where: { id: round.id } }
  ).then(async () => {
    return await getRoundById(round.id);
  });

  return result;
};

export const deleteRound = async (id) => {
  const haveRound = await findRoundById(id);
  if (new Date(haveRound.timeStart) <= new Date()) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM("Round is already started,can't delete")
    );
  }
  if (!haveRound) {
    throw new HttpException(400, ErrorMessage.OBJECT_IS_NOT_EXISTING("Round"));
  }
  const judges = await judgeService.getAllJudgeByRound(id);
  if (judges.data.length > 0) {
    throw new HttpException(
      400,
      ErrorMessage.OBJECT_CANNOT_DELETE_ADD_OTHER("round", "judges")
    );
  }

  // const scores = await scoreService.getAllScoreByRound(id);

  // if (scores.data.length > 0) {
  //   throw new HttpException(400, ErrorMessage.CUSTOM("Score"));
  // }

  const deleteRound = await db.Round.destroy({
    where: {
      id: id,
    },
  });
  return deleteRound;
};

const getCurrentRound = async (id) => {
  const competition = await competitionService.getCompetitionIncludeRounds(id);
  return competition;
};

export default {
  getAllRounds,
  createRound,
  getRoundsByCompetition,
  updateRound,
  deleteRound,
  getRoundById,
  getRoundsByExamForm,
  getCurrentRound,
  getRoundById,
};
