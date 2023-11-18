import {
  successResponse,
  STATUS_CODE,
  errorValidateResponse,
} from "./baseController";
import employeeService from "../services/employeeService";
import { validateData } from "../utils/validateData";
import employeeValidate from "../validations/employeeValidation";

const getAllEmployees = async (req, res, next) => {
  try {
    const result = await employeeService.getAllEmployees();
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    if (!req.body.accountEmployee) {
      return res.status(422).json({
        status: 422,
        message: "Invalid format",
      });
    }

    const err = await validateData(employeeValidate.create, req.body);
    if (err) {
      return errorValidateResponse(422, err, res);
    }
    const result = await employeeService.createEmployee(req.body);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};
export default {
  getAllEmployees,
  createEmployee,
};
