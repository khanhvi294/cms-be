import classService from "../services/classService";
import { successResponse, STATUS_CODE } from "./baseController";

// const getAllCourses = async (req, res, next) => {
//   try {
//     const result = await courseService.getAllCourses();
//     successResponse(STATUS_CODE.OK, result, res);
//   } catch (error) {
//     next(error);
//   }
// };
const createClass = async (req, res, next) => {
  try {
    const result = await classService.createClass(req.body);
    successResponse(STATUS_CODE.CREATED, result, res);
  } catch (error) {
    next(error);
  }
};

// const updateCourse = async (req, res, next) => {
//   try {
//     const result = await courseService.updateCourse(req.body);
//     successResponse(STATUS_CODE.OK, result, res);
//   } catch (error) {
//     next(error);
//   }
// };

export default {
  // getAllCourses,
  createClass,
  // updateCourse,
};
