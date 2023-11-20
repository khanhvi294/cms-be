import { Op } from "sequelize";
import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";
import courseService from "./courseService";
import ErrorMessage from "../common/errorMessage";
import studentService from "./studentService";

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
  const checkClassRoom = await db.Class.findOne({
    where: { name: classRoom.name, id: { [Op.ne]: classRoom.id } },
  });
  return checkClassRoom;
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
  if (checkName(classRoom)) {
    throw new HttpException(400, "Name is exists");
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

const getClassChooseJoin = async (timeStart) => {
  const data = await db.Class.findAll({
    where: {
      timeEnd: {
        [db.Sequelize.Op.gt]: timeStart,
      },
    },
  });

  return data;
};

export const checkStudentByStudentIdAndClassId = async (data) => {
  const studentClass = await db.StudentClass.findOne({
    where: { studentId: data.studentId, classId: data.classId },
  });

  if (studentClass) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM("This student is already in class " + data.classId)
    );
  }
  return false;
};

export const addStudent = async (data) => {
  /**
   * data {
   *    studentId
   *    classId
   * }
   */

  if (!data.studentId || !data.classId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  // check student va class ton tai hay khong
  // check student da duoc add vo lop chua
  await Promise.all([
    studentService.getStudentById(data.studentId),
    getClassById(data.classId),
    checkStudentByStudentIdAndClassId(data),
  ]);

  const studentRegister = await db.StudentClass.create({
    studentId: data.studentId,
    classId: data.classId,
  });

  return studentRegister;
};

export const addMultipleStudent = async (data) => {
  /**
   * ex: data = {
   *    classId: 12,
   *    studentIds: [1,2,3,4,5]
   * }
   */

  if (!data?.classId || !data?.studentIds?.length) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  try {
    const result = await sequelize.transaction(async (t) => {
      // console.log("response ", response, judgesPromise);

      const studentsPromise = await data.studentIds.map(async (item) => {
        return addStudent(
          {
            studentId: item,
            classId: data.classId,
          },
          t
        );
      });

      const response = await Promise.all(studentsPromise);
      return response;
    });
    return result;
  } catch (error) {
    console.log("ERROR:: ", error);
    throw new HttpException(400, error);
  }
}

export default {
  addStudent,
  getAllClasses,
  createClass,
  updateClass,
  getClassById,
  getClassChooseJoin,
};
