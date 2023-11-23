import {
  successResponse,
  STATUS_CODE,
  errorValidateResponse,
} from "./baseController";
import roundService from "../services/roundService";
import { validateData } from "../utils/validateData";
import roundValidation from "../validations/roundValidation";

const getAllRounds = async (req, res, next) => {
  try {
    const result = await roundService.getAllRounds();
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const getRoundsByCompetition = async (req, res, next) => {
  try {
    const result = await roundService.getRoundsByCompetition(
      req.params.competitionId
    );
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const createRound = async (req, res, next) => {
  try {
    // validate data sau

    /*
      data format
      {
       
      }
    */
    const err = await validateData(roundValidation.create, req.body);
    if (err) {
      return errorValidateResponse(422, err, res);
    }
    const result = await roundService.createRound(req.body);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const deleteRound = async (req, res, next) => {
  try {
    const result = await roundService.deleteRound(req.params.id);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllRounds,
  createRound,
  getRoundsByCompetition,
  deleteRound,
};
