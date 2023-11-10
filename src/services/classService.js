import HttpException from "../errors/httpException";
import db from "../models";

const findClassRoomByName = async (nameCourse) => {
  const course = await db.Course.findOne({ where: { name: nameCourse } });
  return course;
};

const checkTimeStart = (timeStart) => {
  const currentDate = new Date();
  const isRight = Date.parse(timeStart) > Date.parse(currentDate);
  return isRight;
};
const checkTimeEnd = (timeEnd, timeStart) => {
  const isRight = Date.parse(timeEnd) >= Date.parse(timeStart);
  return isRight;
};
const createClass = async (classRoom) => {
  const haveClassRoom = await findClassRoomByName(classRoom.name);
  if (haveClassRoom) {
    throw new HttpException(400, "classRoom already exists");
  }
  if (!checkTimeStart(classRoom.timeStart)) {
    throw new HttpException(400, "TimeStart is not suitable");
  }
  if (!checkTimeEnd(classRoom.timeEnd, classRoom.timeStart)) {
    throw new HttpException(400, "TimeEnd is not suitable");
  }

  const newClassRoom = await db.Class.create(classRoom);
  return newClassRoom;
};

// const updateCourse = async (course) => {
//   const result = findCourseById(course.id);
//   if (!result) {
//     throw new HttpException(400, "Course not exists");
//   }
//   const upCourse = await db.Course.update(course, {
//     where: { id: course.id },
//   });
//   return upCourse;
// };

export default {
  // getAllCourses,
  createClass,
  // updateCourse,
};
