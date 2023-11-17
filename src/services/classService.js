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
  return classRoom;
};

const getClassById = async (id) => {
  if (!id) {
    throw new HttpException(
      422,
      ErrorMessage.OBJECT_IS_NOT_EXISTING(`Class ${id}`)
    );
  }

  const classRoom = await db.Class.findOne({ where: { id: id } });

  if (!classRoom) {
    throw new HttpException(400, ErrorMessage.OBJECT_NOT_FOUND(`Class ${id}`));
  }

  return classRoom;
};

const checkTimeStart = (timeStart) => {
  const currentDate = new Date();
  // console.log("dada", Date.parse(timeStart), Date.parse(currentDate));
  const isRight = Date.parse(timeStart) > Date.parse(currentDate);
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
  const findCoursePromise = courseService.getCourseById(classRoom.courseId);

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

  const course = await courseService.findCourseById(classRoom.courseId);
  const timeEnd = new Date(classRoom.timeStart);

  timeEnd.setMonth(timeEnd.getMonth() + course.trainingTime);
  classRoom.timeEnd = timeEnd;

  const newClassRoom = await db.Class.create(classRoom);
  return newClassRoom;
};

const updateClass = async (classRoom) => {
  const result = await findClassById(classRoom.id);

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
  if (!checkName(classRoom)) {
    throw new HttpException(400, "Name is not exists");
  }
  const course = await courseService.findCourseById(classRoom.courseId);
  const timeEnd = new Date(classRoom.timeStart);
  timeEnd.setMonth(timeEnd.getMonth() + course.trainingTime);
  classRoom.timeEnd = timeEnd;
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
  getClassById,
};
