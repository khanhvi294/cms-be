import { successResponse, STATUS_CODE } from "./baseController";
import employeeService from "../services/employeeService";

const getAllEmployees = async (req, res, next) => {
  try {
    const result = await employeeService.getAllEmployees();
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllEmployees,
};
