import { successResponse, STATUS_CODE } from "./baseController";
import studentService from "../services/studentService";

const getAllStudents = async (req, res, next) => {
  try {
    const result = await studentService.getAllStudents();
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllStudents,
};
