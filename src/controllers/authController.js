import {
  STATUS_CODE,
  errorValidateResponse,
  successResponse,
} from "./baseController";

import authService from "../services/authService";
import authValidate from "../validations/authValidation";
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

const changePassword = async (req, res, next) => {
  try {
    const user = await authService.changePassword(req.body, req.user.id);
    successResponse(STATUS_CODE.OK, user, res);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const err = await validateData(authValidate.forgotPassword, req.body);
    if (err) {
      return errorValidateResponse(422, err, res);
    }
    await authService.forgotPassword(req.body.email);
    successResponse(
      STATUS_CODE.OK,
      {
        message: "Please check your email to reset password",
      },
      res
    );
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body);
    successResponse(
      STATUS_CODE.OK,
      {
        message: "Reset password successfully",
      },
      res
    );
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  getInfo,
  changePassword,
  forgotPassword,
  resetPassword,
};
