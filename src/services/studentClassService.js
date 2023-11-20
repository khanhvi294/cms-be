import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";

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
    order: [["updatedAt", "DESC"]],
  });

  return resFindAll(data);
};

const getAllClassesByStudent = async (studentId) => {
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
  });
  return resFindAll(data);
};

export default {
  getAllStudentByClass,
  getAllClassesByStudent,
};
