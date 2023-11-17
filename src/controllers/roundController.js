import { successResponse, STATUS_CODE } from "./baseController";
import roundService from "../services/roundService";

const getAllRounds = async (req, res, next) => {
  try {
    const result = await roundService.getAllRounds();
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
        accountStudent: {
          email: 
        }
        fullName
      }
    */

    const result = await roundService.createRound(req.body);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllRounds,
  createRound,
};
