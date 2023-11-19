import {
  successResponse,
  STATUS_CODE,
  errorValidateResponse,
} from "./baseController";
import scoreService from "../services/scoreService";

const createScore = async (req, res, next) => {
  try {
    const result = await scoreService.createScore();
    successResponse(STATUS_CODE.CREATED, result, res);
  } catch (error) {
    next(error);
  }
};

const getScoreByRound = async (req, res, next) => {
  try {
    const result = await scoreService.getScoreByRound();
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

export default {
  createScore,
  getScoreByRound,
};
