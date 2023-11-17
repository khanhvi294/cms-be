import HttpException from "../errors/httpException";
import db from "../models";
import { ROLES, resFindAll } from "../utils/const";
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

export const findJudgeByEmployeeIdAndRoundId = async (data) => {
  if (!data.employeeId || !data.roundId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const judge = await db.Judge.findOne({
    where: { roundId: data.roundId, employeeId: data.employeeId },
  });
  return judge;
};

export const createJudge = async (data) => {
  const checkJudge = await findJudgeByEmployeeIdAndRoundId(data);
  if (checkJudge) {
    throw new HttpException(400, ErrorMessage.OBJECT_IS_EXISTING("Judge"));
  }

  const employeePromise = employeeService.getEmployeeByIdIncludesAccount(
    data.employeeId
  );
  const roundPromise = roundService.getRoundById(data.roundId);

  const [employee] = await Promise.all([employeePromise, roundPromise]);

  if (employee?.accountEmployee?.role != ROLES.TEACHER) {
    throw new HttpException(400, ErrorMessage.DATA_IS_INVALID("Data"));
  }

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
