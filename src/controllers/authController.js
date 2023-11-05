import authService from "../services/authService";
import { successReponse, STATUS_CODE } from "./baseController";

const login = async (req, res) => {
  try {
    // await validateData(userValidate.login, req.body, res)
    const result = await authService.login(req.body.email, req.body.password);

    successReponse(STATUS_CODE.OK, { token: result.token }, res);
  } catch (error) {
    next(error);
  }
};

export default {
  login,
};
