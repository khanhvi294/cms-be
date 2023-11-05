import authService from "../services/authService";
import { STATUS_CODE } from "./base";

const login = async (req, res) => {
  try {
    const result = await courseService.login();
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

export default {
  login,
};
