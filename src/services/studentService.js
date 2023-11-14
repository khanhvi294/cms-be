import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";

export const findStudentById = async (id) => {
  if (!id) {
    throw new HttpException(400, "Missing parameter");
  }

  const data = await db.Students.findOne({
    where: { id: id },
    attributes: { exclude: ["createdAt", "updatedAt", "password"] },
  });
  return data;
};

export const getStudentById = async (id) => {
  const data = await findStudentById(id);
  if (!data) {
    throw new HttpException(404, "Student not found");
  }
  return data;
};

export const findStudentByEmail = async (email) => {
  if (!email) {
    throw new HttpException(400, "Missing parameter");
  }
};

export const getAllStudents = async () => {
  const data = await db.Students.findAll({
    raw: true,
    nest: true,
    attributes: { exclude: ["accountId"] },
    include: [
      {
        model: db.Account,
        as: "accountStudent",
        attributes: ["email", "isActive"],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });
  return resFindAll(data);
};
export const createStudent = async () => {};
export const updateStudent = async () => {};
export const changeStatusStudent = async () => {};

export default {
  findStudentById,
  getStudentById,
  findStudentByEmail,
  getAllStudents,
  createStudent,
  updateStudent,
  changeStatusStudent,
};
