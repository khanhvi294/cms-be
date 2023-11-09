// import db from "../models";

// const findClassRoomByName = async (nameCourse) => {
//   const course = await db.Course.findOne({ where: { name: nameCourse } });
//   return course;
// };

// const checkTimeStart = (timeStart) => {
//   const currentDate = new Date();
//   const isRight = Date.parse(timeStart) > Date.parse(currentDate);
//   return isRight;
// };
// const createClass = async (classRoom) => {
//   const haveClassRoom = await findClassRoomByName(classRoom.name);
//   console.log(checkTimeStart(classRoom.timeStart));
//   if (haveClassRoom) {
//     throw new HttpException(400, "classRoom already exists");
//   }
//   if (!checkClassRoomTime(classRoom.trainingTime)) {
//     throw new HttpException(400, "Time is not suitable");
//   }
//   //const newClassRoom = await db.classRoom.create(classRoom);
//   return newClassRoom;
// };

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

// export default {
//   getAllCourses,
//   createCourse,
//   updateCourse,
// };
