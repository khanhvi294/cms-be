import db from "../models";

const findCourseByName = async (nameCourse) => {
  const course = await db.Course.findOne({ where: { name: nameCourse } });
  return course;
};
const checkCourseTime = (time) => {
  if (time > 0) return true;
  return false;
};

const getAllCourses = async (course) => {};
const createCourse = async () => {
  const haveCourse = await findCourseByName(course.name);
  if (haveCourse) {
    throw new HttpException(400, "Course already exists");
  }
  if (!checkCourseTime(course.time)) {
    throw new HttpException(400, "Time is not suitable");
  }
  const newCourse = await db.Course.create(course);
  return newCourse;
};

export default {
  getAllCourses,
  createCourse,
};
