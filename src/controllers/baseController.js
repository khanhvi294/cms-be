import { STATUS } from "../utils/const";

export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
};

export const successReponse = (status = 200, data = {}, res) => {
  return res.status(status).json({ data, status, message: STATUS.success });
};
