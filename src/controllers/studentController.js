import {
  successResponse,
  STATUS_CODE,
  errorValidateResponse,
} from "./baseController";
import studentService from "../services/studentService";
import studentValidate from "../validations/studentValidation";
import { validateData } from "../utils/validateData";

const getAllStudents = async (req, res, next) => {
  try {
    const result = await studentService.getAllStudents();
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    // validate data sau

    /*
      data format
      {
        accountStudent: {
          email: 
        }
        fullName
      }
    */

    if (!req.body.accountStudent) {
      return res.status(422).json({
        status: 422,
        message: "Invalid format",
      });
    }

    const err = await validateData(studentValidate.create, req.body);
    if (err) {
      return errorValidateResponse(422, err, res);
    }
    const result = await studentService.createStudent(req.body);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllStudents,
  createStudent,
};
