import { successReponse, STATUS_CODE } from "./baseController";

const getAllCourses = (req, res, next) => {
  try {
    // call service
    successReponse(STATUS_CODE.OK, { message: " ok" }, res);
  } catch (error) {
    next(error);
  }
};

const createCourse = (req, res, next) => {
  try {
    // call service
    successReponse(STATUS_CODE.OK, { message: " ok" }, res);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllCourses,
  createCourse,
};
