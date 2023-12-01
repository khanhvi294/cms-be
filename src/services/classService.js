import { Op } from "sequelize";
import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";
import courseService from "./courseService";
import ErrorMessage from "../common/errorMessage";
import studentService from "./studentService";
import { sequelize } from "../config/connectDB";
import studentClassService from "./studentClassService";
import competitionClassService from "./competitionClassService";

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

const checkNameUpdate = async (classRoom) => {
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
  const dateCheck = new Date(result.timeStart);

  if (!result) {
    throw new HttpException(400, "Class not exists");
  }
  if (dateCheck > new Date()) {
    if (!checkTimeStart(classRoom.timeStart)) {
      throw new HttpException(400, "TimeStart is not suitable");
    }
    if (!!(await checkNameUpdate(classRoom))) {
      throw new HttpException(400, "Name is exists");
    }
    if (classRoom.timeStart) {
      const course = await courseService.findCourseById(classRoom.courseId);
      const timeEnd = new Date(classRoom.timeStart);
      timeEnd.setMonth(timeEnd.getMonth() + course.trainingTime);
      classRoom.timeEnd = timeEnd;
    }

    const upClass = await db.Class.update(classRoom, {
      where: { id: classRoom.id },
    });

    return upClass;
  } else {
    throw new HttpException(400, "Class is started,can't update");
  }
};

const getAllClasses = async () => {
  const data = await db.Class.findAll({
    raw: true,
    nest: true,
    attributes: { exclude: ["CourseId"] },
    include: [
      {
        model: db.Course,
        as: "courseClass",
        attributes: ["name"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  return resFindAll(data);
};

const getClassChooseJoin = async (timeStart) => {
  const data = await db.Class.findAll({
    where: {
      timeEnd: {
        [db.Sequelize.Op.gt]: timeStart,
      },
    },
    order: [["createdAt", "DESC"]],
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
  const classRoom = await findClassById(data.classId);
  const sevenDay = new Date(classRoom.timeStart);
  sevenDay.setDate(sevenDay.getDate() + 7);

  if (new Date() >= sevenDay) {
    throw new HttpException(
      422,
      ErrorMessage.CUSTOM("Class has started 1 week, can't add students")
    );
  }

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
};

const getClassByCourseId = async (courseId) => {
  const data = await db.Class.findAll({
    where: {
      courseId: courseId,
    },
    order: [["createdAt", "DESC"]],
  });

  return data;
};

const deleteClass = async (id) => {
  const haveClass = await findClassById(id);

  if (!haveClass) {
    throw new HttpException(400, ErrorMessage.OBJECT_IS_NOT_EXISTING("Class"));
  }
  const students = await studentClassService.getAllStudentByClass(id);
  const competitions =
    await competitionClassService.getAllCompetitionByClass(id);

  if (students.data.length > 0) {
    throw new HttpException(
      400,
      ErrorMessage.OBJECT_CANNOT_DELETE_GIVEN_OTHER("This Class", "students")
    );
  }
  if (competitions.data.length > 0) {
    throw new HttpException(
      400,
      ErrorMessage.OBJECT_CANNOT_DELETE_ADD_OTHER("This class", "competition")
    );
  }
  const deleteClass = await db.Class.destroy({
    where: {
      id: id,
    },
  });
  return deleteClass;
};

export default {
  addStudent,
  getAllClasses,
  createClass,
  updateClass,
  getClassById,
  getClassChooseJoin,
  addMultipleStudent,
  getClassByCourseId,
  deleteClass,
};
