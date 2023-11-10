import { Op } from "sequelize";
import HttpException from "../errors/httpException";
import db from "../models";

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
    throw new HttpException(400, "Name is exits");
  }
  const upClass = await db.Class.update(classRoom, {
    where: { id: classRoom.id },
  });
  return upClass;
};

export default {
  // getAllCourses,
  createClass,
  updateClass,
};
