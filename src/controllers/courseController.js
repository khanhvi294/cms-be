import courseService from "../services/courseService";
import { successResponse, STATUS_CODE } from "./baseController";

const getAllCourses = (req, res, next) => {
  try {
    // call service
    successResponse(STATUS_CODE.OK, { message: " ok" }, res);
  } catch (error) {
    next(error);
  }
};

const createCourse = (req, res, next) => {
  try {
    courseService.createCourse(req.course);
    successResponse(STATUS_CODE.OK, { message: " ok" }, res);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllCourses,
  createCourse,
};
