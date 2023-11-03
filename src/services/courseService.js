import db from "../models";

const getCourseById = async (courseId) => {
  if (!courseId) {
    // sau nay tra loi, lam custom error da
  }
};

const getCourseByName = async (courseName) => {
  const course = await db.Course.findOne({ where: { courseName } });
  return course;
};

const checkCourseNameIsExist = async (courseName) => {
  const course = await db.Course.findOne({ where: { courseName } });
  if (course) {
    // throw error o day, lam sau
  }
  return false;
};

const createCourse = async (data) => {
  const course = await db.Course.create({
    name: data.name,
    trainingTime: data.trainingTime,
  });
  return course;
};

const getAllCourses = async () => {
  const courses = await db.Course.findAll();
  return {
    data: courses,
    total: courses.length,
  };
};

export default {
  getAllCourses,
  createCourse,
  checkCourseNameIsExist,
  getCourseByName,
};
