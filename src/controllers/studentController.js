import {
  successResponse,
  STATUS_CODE,
  errorValidateResponse,
} from "./baseController";
import studentService from "../services/studentService";
import studentValidate from "../validations/studentValidation";
import { formatInfoProfile, validateData } from "../utils/validateData";
import studentClassService from "../services/studentClassService";
import authService from "../services/authService";

const getAllStudents = async (req, res, next) => {
  try {
    const result = await studentService.getAllStudents();
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const getAllClassesByStudent = async (req, res, next) => {
  try {
    const result = await studentClassService.getAllClassesByStudent(
      req.params.id
    );
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const getCompetitionsForStudent = async (req, res, next) => {
  try {
    const result = await studentService.getCompetitionsForStudent(
      req.params.id
    );
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const result = await studentService.getStudentById();
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};
const getStudentAddClass = async (req, res, next) => {
  try {
    const result = await studentService.getStudentAddClass(req.params.classId);
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
    const dataFormat = await formatInfoProfile(req.body);

    const result = await studentService.createStudent(dataFormat);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const err = await validateData(studentValidate.update, req.body);
    if (err) {
      return errorValidateResponse(422, err, res);
    }

    const student = await authService.getStudentByAccount(req?.user.id);

    const dataFormat = await formatInfoProfile(req.body);
    const result = await studentService.updateStudent(
      student?.accountStudent?.id || -1,
      dataFormat
    );
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllStudents,
  createStudent,
  getStudentById,
  getAllClassesByStudent,
  getCompetitionsForStudent,
  updateStudent,
  getStudentAddClass,
};
