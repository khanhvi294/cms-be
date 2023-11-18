import authService from "../services/authService";
import {
  successResponse,
  STATUS_CODE,
  errorValidateResponse,
} from "./baseController";
import userValidate from "../validations/userValidation";
import { validateData } from "../utils/validateData";

const login = async (req, res, next) => {
  try {
    const err = await validateData(userValidate.login, req.body);
    if (err) {
      return errorValidateResponse(422, err, res);
    }
    const result = await authService.login(req.body.email, req.body.password);

    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const getInfo = async (req, res, next) => {
  try {
    const user = await authService.getInfo(req.user.id);
    successResponse(STATUS_CODE.OK, user, res);
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  getInfo,
};
