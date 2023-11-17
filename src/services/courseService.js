import db from "../models";
import { resFindAll } from "../utils/const";
import HttpException from "../errors/httpException";
import ErrorMessage from "../common/errorMessage";

const findCourseByName = async (nameCourse) => {
  const course = await db.Course.findOne({ where: { name: nameCourse } });
  return course;
};
const findCourseById = async (id) => {
  const course = await db.Course.findOne({
    where: {
      id: id,
    },
  });
  return course;
};

const getCourseById = async (id) => {
  if (!id) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const course = await db.Course.findOne({
    where: {
      id: id,
    },
  });
  return course;
};

const checkCourseTime = (time) => {
  if (time > 0) return true;
  return false;
};

export const getAllCourses = async () => {
  const data = await db.Course.findAll({
    order: [["updatedAt", "DESC"]],
  });
  return resFindAll(data);
};

const createCourse = async (course) => {
  const haveCourse = await findCourseByName(course.name);
  if (haveCourse) {
    throw new HttpException(400, ErrorMessage.OBJECT_IS_EXISTING("Course"));
  }
  if (!checkCourseTime(course.trainingTime)) {
    throw new HttpException(400, "Time is not suitable");
  }
  const newCourse = await db.Course.create(course);
  return newCourse;
};

const updateCourse = async (course) => {
  const result = findCourseById(course.id);

  if (!result) {
    throw new HttpException(400, ErrorMessage.OBJECT_IS_NOT_EXISTING("Course"));
  }
  if (!checkCourseTime(course.trainingTime)) {
    throw new HttpException(400, ErrorMessage.DATA_IS_INVALID("Time"));
  }
  const upCourse = await db.Course.update(course, {
    where: { id: course.id },
  });
  return upCourse;
};

export default {
  getAllCourses,
  createCourse,
  updateCourse,
};
