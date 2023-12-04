import {
  successResponse,
  STATUS_CODE,
  errorValidateResponse,
} from "./baseController";
import roundService from "../services/roundService";
import { validateData } from "../utils/validateData";
import roundValidation from "../validations/roundValidation";
import roundResultService from "../services/roundResultService";
import authService from "../services/authService";

const getCurrentRound = async (req, res, next) => {
  try {
    const result = await roundService.getCurrentRound(req.params.id);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const getFirstRound = async (req, res, next) => {
  try {
    const result = await roundService.getFirstRound(req.params.id);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const getNextRound = async (req, res, next) => {
  try {
    const result = await roundService.getNextRound(
      req.params.id,
      req.query.roundId
    );
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const updateRoundResult = async (req, res, next) => {
  try {
    const employee = await authService.getEmployeeByAccount(req?.user.id);
    const result = await roundResultService.updateRoundResult(employee?.accountEmployee.id, req.body, true);
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

const checkStudentPassRound = async (req, res, next) => {
  try {
    const result = await roundResultService.checkStudentPassRound(req.body);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const confirmStudentPassRound = async (req, res, next) => {
  try {
    const result = await roundResultService.confirmStudentPassRound(req.body);
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
  checkStudentPassRound,
  confirmStudentPassRound,
  getFirstRound,
  getNextRound,
};
