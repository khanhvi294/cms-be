import HttpException from "../errors/httpException";
import db from "../models";
import { ROLES, resFindAll } from "../utils/const";
import ErrorMessage from "../common/errorMessage";
import employeeService from "./employeeService";
import { sequelize } from "../config/connectDB";
import roundService from "./roundService";

export const getAllJudgeByRound = async (roundId) => {
  if (!roundId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.Judge.findAll({
    where: { roundId: roundId },
    raw: true,
    nest: true,
    attributes: { exclude: ["employeeId"] },
    include: [
      {
        model: db.Employee,
        as: "employeeJudge",
        attributes: ["fullName", "id"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return resFindAll(data);
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

const createJudgeByEmployee = async (data, t) => {
  const checkJudge = await findJudgeByEmployeeIdAndRoundId(data);
  if (checkJudge) {
    throw new HttpException(400, ErrorMessage.OBJECT_IS_EXISTING("Judge"));
  }

  const employee = await employeeService.getEmployeeByIdIncludesAccount(
    data.employeeId
  );

  if (employee?.accountEmployee?.role != ROLES.TEACHER) {
    throw new HttpException(400, ErrorMessage.DATA_IS_INVALID("Data"));
  }

  const judge = await db.Judge.create(
    {
      employeeId: data.employeeId,
      roundId: data.roundId,
    },
    { transaction: t }
  );

  // console.log("judge ", judge);

  return judge;
};

export const createJudgesForRound = async (data) => {
  /**
   * ex: data = {
   *    roundId: 12,
   *    employeeIds: [1,2,3,4,5]
   * }
   */

  if (!data?.employeeIds || !data?.employeeIds?.length) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  try {
    const result = await sequelize.transaction(async (t) => {
      // console.log("response ", response, judgesPromise);

      const judgesPromise = await data.employeeIds.map(async (item) => {
        return createJudgeByEmployee(
          {
            employeeId: item,
            roundId: data.roundId,
          },
          t
        );
      });

      const response = await Promise.all(judgesPromise);
      return response;
    });

    // if (result?.dataValues) {
    //   return result.dataValues;
    // }
    return result;
  } catch (error) {
    console.log("ERROR:: ", error);
    throw new HttpException(400, error);
  }
};

export const deleteJudgeInRound = async (teacherId, roundId) => {
  if (!roundId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }
  if (!teacherId) throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  const round = await roundService.getRoundById(roundId);
  if (new Date(round.timeStart) <= new Date()) {
    throw new HttpException(
      422,
      ErrorMessage.CUSTOM("Round has started, can't removed judge")
    );
  }
  const data = await db.Judge.destroy({
    where: { roundId: roundId, employeeId: teacherId },
  });
  return data;
};

export default {
  getAllJudgeByRound,
  createJudge,
  createJudgesForRound,
  deleteJudgeInRound,
};
