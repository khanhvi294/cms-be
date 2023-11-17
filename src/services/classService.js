import { Op } from "sequelize";
import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";
import courseService from "./courseService";
import ErrorMessage from "../common/errorMessage";

const findClassRoomByName = async (nameClass) => {
  const classRoom = await db.Class.findOne({ where: { name: nameClass } });
  return classRoom;
};
const findClassById = async (id) => {
  const classRoom = await db.Class.findOne({ where: { id: id } });
  console.log("dddđ", classRoom);
  return classRoom;
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

const checkName = async (classRoom) => {
  const course = await db.Course.findOne({
    where: { name: classRoom.name, id: { [Op.ne]: classRoom.id } },
  });
  return course;
};
const createClass = async (classRoom) => {
  const haveClassRoomPromise = findClassRoomByName(classRoom.name);
  const findCoursePromise = findCourseByName(classRoom.courseId);

  const [haveClassRoom, findCourse] = await Promise.all([
    haveClassRoomPromise,
    findCoursePromise,
  ]);

  if (haveClassRoom) {
    throw new HttpException(400, ErrorMessage.OBJECT_IS_EXISTING("Class"));
  }

  if (!findCourse) {
    throw new HttpException(400, ErrorMessage.OBJECT_NOT_FOUND("Course"));
  }

  if (!checkTimeStart(classRoom.timeStart)) {
    throw new HttpException(400, ErrorMessage.DATA_IS_INVALID("TimeStart"));
  }
  if (!checkTimeEnd(classRoom.timeEnd, classRoom.timeStart)) {
    throw new HttpException(400, ErrorMessage.DATA_IS_INVALID("TimeEnd"));
  }

  const newClassRoom = await db.Class.create(classRoom);
  return newClassRoom;
};

const updateClass = async (classRoom) => {
  const result = await findClassById(classRoom.id);
  console.log("hhhhh", result);
  if (!result) {
    throw new HttpException(400, "Class not exists");
  }
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
  if (!checkName(classRoom)) {
    throw new HttpException(400, "Name is not exists");
  }
  const upClass = await db.Class.update(classRoom, {
    where: { id: classRoom.id },
  });
  return upClass;
};

const getAllClasses = async () => {
  const data = await db.Class.findAll();
  return resFindAll(data);
};

export const addStudent = async () => {};

export default {
  addStudent,
  getAllClasses,
  createClass,
  updateClass,
};
