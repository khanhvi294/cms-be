import classService from "../services/classService";
import {
  successResponse,
  STATUS_CODE,
  errorValidateResponse,
} from "./baseController";
import classValidate from "../validations/classValidation";
import { validateData } from "../utils/validateData";
import studentClassService from "../services/studentClassService";

const getAllClasses = async (req, res, next) => {
  try {
    const result = await classService.getAllClasses();
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};
const createClass = async (req, res, next) => {
  try {
    const err = await validateData(classValidate.create, req.body);
    if (err) {
      return errorValidateResponse(422, err, res);
    }
    const result = await classService.createClass(req.body);
    successResponse(STATUS_CODE.CREATED, result, res);
  } catch (error) {
    next(error);
  }
};
const updateClass = async (req, res, next) => {
  try {
    const result = await classService.updateClass(req.body);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const addStudent = async (req, res, next) => {
  try {
    const result = await classService.addStudent(req.body);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const addMultipleStudent = async (req, res, next) => {
  try {
    const result = await classService.addMultipleStudent(req.body);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const getAllStudentByClass = async (req, res, next) => {
  try {
    const result = await studentClassService.getAllStudentByClass(
      req.params.classId
    );
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllClasses,
  createClass,
  updateClass,
  addStudent,
  addMultipleStudent,
  getAllStudentByClass,
};
