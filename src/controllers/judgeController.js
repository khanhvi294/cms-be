import judgeService from "../services/judgeService";
import { successResponse, STATUS_CODE } from "./baseController";

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

export default {
  createJudge,
  getAllJudgeByRound,
};
