import {
  successResponse,
  STATUS_CODE,
  errorValidateResponse,
} from "./baseController";
import scoreService from "../services/scoreService";
import { validateData } from "../utils/validateData";
import scoreValidation from '../validations/scoreValidation';

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

const createScoreOnRound = async (req, res, next) => {
  try {
    const err = await validateData(scoreValidation.createOnRound, req.body);
    if (err) {
      return errorValidateResponse(422, err, res);
    }
    const result = await scoreService.createScoreOnRound(req.body);
    successResponse(STATUS_CODE.CREATED, result, res);

  } catch (error) {
    next(error);
  }
}

export default {
  createScore,
  getScoreByRound,createScoreOnRound
};
