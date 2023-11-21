import courseService from "../services/courseService";
import { validateData } from "../utils/validateData";
import courseValidation from "../validations/courseValidation";
import {
  successResponse,
  STATUS_CODE,
  errorValidateResponse,
} from "./baseController";

const getAllCourses = async (req, res, next) => {
  try {
    const result = await courseService.getAllCourses();
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};
const createCourse = async (req, res, next) => {
  try {
    const err = await validateData(courseValidation.create, req.body);
    if (err) {
      return errorValidateResponse(422, err, res);
    }
    const result = await courseService.createCourse(req.body);
    successResponse(STATUS_CODE.CREATED, result, res);
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const result = await courseService.deleteCourse(req.params.id);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const err = await validateData(courseValidation.create, req.body);
    if (err) {
      return errorValidateResponse(422, err, res);
    }
    const result = await courseService.updateCourse(req.params.id, req.body);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
