import competitionService from "../services/competitionService";
import {
  successResponse,
  STATUS_CODE,
  errorValidateResponse,
} from "./baseController";
import authService from "../services/authService";
import competitionClassService from "../services/competitionClassService";
import { validateData } from "../utils/validateData";
import competitionValidation from "../validations/competitionValidation";
import classService from "../services/classService";

const getAllCompetition = async (req, res, next) => {
  try {
    const result = await competitionService.getAllCompetition();
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const getCompetitionById = async (req, res, next) => {
  try {
    const result = await competitionService.getCompetitionById(req.params.id);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const getClass = async (req, res, next) => {
  try {
    const result = await classService.getClassChooseJoin(req.params.timeStart);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};
const getAllClassCanJoinCompetition = async (req, res, next) => {
  try {
    const result = await competitionClassService.getAllClassCanJoinCompetition(
      req.params.id
    );
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const createCompetition = async (req, res, next) => {
  try {
    /*
      FORMAT
        {
          name
          maximumQuantity
          minimumQuantity
          numOfPrizes
          numberOfRound
          timeStart
          timeEnd
          competitionClass: ["1","2","3","4","5"]
        }
    */

    // const err = await validateData(competitionValidation.create, req.body);
    // if (err) {
    //   return errorValidateResponse(422, err, res);
    // }

    const employee = await authService.getEmployeeByAccount(req.user.id);
    const result = await competitionService.createCompetition(
      employee.accountEmployee.id,
      req.body
    );
    successResponse(STATUS_CODE.CREATED, result, res);
  } catch (error) {
    next(error);
  }
};

const updateStatusCompetition = async (req, res, next) => {
  try {
    /*
      FORMAT 
        {
         
        }
    */

    const result = await competitionService.updateStatusCompetition(
      req.params.id,
      req.body.statusId
    );
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

export default {
  createCompetition,
  getAllCompetition,
  updateStatusCompetition,
  getAllClassCanJoinCompetition,
  getClass,
  getCompetitionById,
};
