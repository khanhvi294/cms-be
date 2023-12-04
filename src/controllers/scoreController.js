import {
  successResponse,
  STATUS_CODE,
  errorValidateResponse,
} from "./baseController";
import scoreService from "../services/scoreService";
import { validateData } from "../utils/validateData";
import scoreValidation from "../validations/scoreValidation";

const getScoreByRoundResult = async (req, res, next) => {
  try {
    const result = await scoreService.getScoreByRoundResult(
      req.params.roundResultId
    );
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

export default {
  getScoreByRoundResult,
};
