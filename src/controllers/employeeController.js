import {
  successResponse,
  STATUS_CODE,
  errorValidateResponse,
} from "./baseController";
import employeeService from "../services/employeeService";
import { formatInfoProfile, validateData } from "../utils/validateData";
import employeeValidate from "../validations/employeeValidation";
import authService from "../services/authService";

const getAllEmployees = async (req, res, next) => {
  try {
    const result = await employeeService.getAllEmployees();
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const getAllTeacherAddJudge = async (req, res, next) => {
  try {
    const result = await employeeService.getAllTeacherAddJudge(
      req.params.roundId
    );
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
    const dataFormat = await formatInfoProfile(req.body);

    const result = await employeeService.createEmployee(dataFormat);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const err = await validateData(employeeValidate.update, req.body);
    if (err) {
      return errorValidateResponse(422, err, res);
    }
    const employee = await authService.getEmployeeByAccount(req?.user.id);
    const dataFormat = await formatInfoProfile(req.body);
    const result = await employeeService.updateEmployee(
      employee?.accountEmployee?.id || -1,
      dataFormat
    );
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};
export default {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  getAllTeacherAddJudge,
};
