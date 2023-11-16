import authService from "../services/authService";
import { successResponse, STATUS_CODE } from "./baseController";

const login = async (req, res, next) => {
  try {
    // await validateData(userValidate.login, req.body, res)
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
