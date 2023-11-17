import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";
import ErrorMessage from "../common/errorMessage";
import employeeService from "./employeeService";
import roundService from "./roundService";

export const getAllJudgeByCompetition = async (competitionId) => {};

export const getAllJudgeByRound = async (roundId) => {
  if (!roundId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.Round.findOne({
    where: { id: roundId },
    raw: true,
    nest: true,
    include: [
      {
        model: db.Judge,
        as: "roundJudge",
      },
    ],
    order: [["updatedAt", "DESC"]],
  });
  if (data.roundJudge) {
    return resFindAll(data.roundJudge);
  }

  return resFindAll([]);
};

export const createJudge = async (data) => {
  await Promise.all[
    (employeeService.getEmployeeById(data.employeeId),
    roundService.getRoundById(data.roundId))
  ];

  const judge = await db.Judge.create({
    employeeId: data.employeeId,
    roundId: data.roundId,
  });

  return judge;
};

export default {
  getAllJudgeByCompetition,
  getAllJudgeByRound,
  createJudge,
};
