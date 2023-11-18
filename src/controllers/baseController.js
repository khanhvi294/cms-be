import { STATUS } from "../utils/const";

export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
};

export const successResponse = (status = 200, data = {}, res) => {
  return res.status(status).json({ data, status, message: STATUS.success });
};

export const errorValidateResponse = (status = 422, error, res) => {
  return res
    .status(status)
    .json({ status: status, message: error.details[0].message });
};
