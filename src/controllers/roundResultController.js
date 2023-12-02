import {
  successResponse,
  STATUS_CODE,
  errorValidateResponse,
} from "./baseController";
import roundService from "../services/roundService";
import { validateData } from "../utils/validateData";
import roundValidation from "../validations/roundValidation";
import roundResultService from "../services/roundResultService";

const getCurrentRound = async (req, res, next) => {
  try {
    const result = await roundService.getCurrentRound(req.body.id);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const updateRoundResult = async (req, res, next) => {
  try {
    const result = await roundResultService.updateRoundResult(req.body, true);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const getRoundResultByRound = async (req, res, next) => {
  try {
    const result = await roundResultService.getRoundResultByRound(
      req.params.roundId
    );
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const tmpCreateRounds = async (req, res, next) => {
  try {
    const result = await roundResultService.tmpCreateRounds(req.body);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

export default {
  getCurrentRound,
  updateRoundResult,
  getRoundResultByRound,
  tmpCreateRounds,
};
