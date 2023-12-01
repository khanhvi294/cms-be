import courseService from "../services/courseService";
import roundResultService from "../services/roundResultService";
import { validateData } from "../utils/validateData";
import courseValidation from "../validations/courseValidation";
import {
  successResponse,
  STATUS_CODE,
  errorValidateResponse,
} from "./baseController";

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

export default {
  getRoundResultByRound,
};
