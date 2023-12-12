import judgeService from "../services/judgeService";
import { successResponse, STATUS_CODE } from "./baseController";
import authService from "../services/authService";

const createJudge = async (req, res, next) => {
  try {
    const result = await judgeService.createJudge(req.body);
    successResponse(STATUS_CODE.CREATED, result, res);
  } catch (error) {
    next(error);
  }
};

const getAllJudgeByRound = async (req, res, next) => {
  try {
    const result = await judgeService.getAllJudgeByRound(req.params.roundId);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const getAllRoundByJudge = async (req, res, next) => {
  try {
    const employee = await authService.getEmployeeByAccount(req.user.id);
    console.log(employee);
    const result = await judgeService.getAllRoundByJudge(
      employee?.accountEmployee.id
    );
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

export const createJudgesForRound = async (req, res, next) => {
  /**
   * ex: data = {
   *    roundId: 12,
   *    employeeIds: [1,2,3,4,5]
   * }
   */
  try {
    console.log("aaaaa", req.body);
    const result = await judgeService.createJudgesForRound(req.body);
    successResponse(STATUS_CODE.CREATED, result, res);
  } catch (error) {
    next(error);
  }
};

const deleteJudgeInRound = async (req, res, next) => {
  try {
    const result = await judgeService.deleteJudgeInRound(
      req.params.employeeId,
      req.params.roundId
    );
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

export default {
  createJudge,
  getAllJudgeByRound,
  createJudgesForRound,
  deleteJudgeInRound,
  getAllRoundByJudge,
};
