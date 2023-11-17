import competitionService from "../services/competitionService";
import { successResponse, STATUS_CODE } from "./baseController";
import authService from "../services/authService";
import competitionClassService from "../services/competitionClassService";

const getAllCompetition = async (req, res, next) => {
  try {
    const result = await competitionService.getAllCompetition();
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
};
