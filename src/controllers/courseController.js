import courseService from "../services/courseService";
import { STATUS_CODE, successResponse } from "./base";

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
    const result = await courseService.createCourse(req.body);
    successResponse(STATUS_CODE.CREATED, result, res);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllCourses,
  createCourse,
};
