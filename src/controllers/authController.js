import authService from "../services/authService";
import { successReponse, STATUS_CODE } from "./baseController";

const login = async (req, res, next) => {
  try {
    // await validateData(userValidate.login, req.body, res)
    const result = await authService.login(req.body.email, req.body.password);

    successReponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

export default {
  login,
};
