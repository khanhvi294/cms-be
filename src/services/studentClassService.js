import { Op } from "sequelize";
import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";
import classService from "./classService";

export const getAllStudentByClass = async (classId) => {
  if (!classId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.StudentClass.findAll({
    where: { classId: classId },
    raw: true,
    nest: true,
    attributes: { exclude: ["studentId"] },
    include: [
      {
        model: db.Students,
        as: "ClassStudentStudent",
        attributes: ["fullName", "id"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return resFindAll(data);
};

export const getAllClassesByStudent = async (studentId) => {
  if (!studentId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.StudentClass.findAll({
    where: { studentId: studentId },
    nest: true,
    raw: false,
    include: [
      {
        model: db.Class,
        as: "ClassStudentClass",
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  return resFindAll(data);
};

export const deleteStudentInClass = async (studentId, classId) => {
  if (!classId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }
  if (!studentId) throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  const classRoom = await classService.getClassById(classId);
  console.log(new Date(classRoom.timeStart) <= new Date());
  if (new Date(classRoom.timeStart) <= new Date()) {
    throw new HttpException(
      422,
      ErrorMessage.CUSTOM("Class has started, can't removed students")
    );
  }
  const data = await db.StudentClass.destroy({
    where: { classId: classId, studentId: studentId },
  });

  return data;
};

export default {
  getAllStudentByClass,
  getAllClassesByStudent,
  deleteStudentInClass,
};
