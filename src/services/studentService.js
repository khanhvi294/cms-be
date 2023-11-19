import HttpException from "../errors/httpException";
import db from "../models";
import { DEFAULT_PASSWORD, ROLES, resFindAll } from "../utils/const";
import authService from "./authService";
import passwordUtil from "../utils/password";
import ErrorMessage from "../common/errorMessage";

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

  const account = await authService.findAccountByEmail(email);
  return account;
};

export const getStudentIncludesObj = async (studentId, obj) => {};

export const getStudentIncludesClass = async (studentId) => {
  if (!studentId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.Students.findOne({
    raw: false,
    nest: true,
    where: { id: studentId },
    attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    include: [
      {
        model: db.StudentClass,
        as: "ClassStudentStudent",
        // attributes: ["email", "isActive"],
        // order: [["updatedAt", "DESC"]],
      },
    ],
  });

  return data;
};

export const getAllStudents = async () => {
  const data = await db.Students.findAll({
    raw: true,
    nest: true,
    attributes: { exclude: ["accountId", "password"] },
    include: [
      {
        model: db.Account,
        as: "accountStudent",
        attributes: ["email", "isActive"],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });
  console.log("serrrrrrrrrrrrrrrrr", data);
  return resFindAll(data);
};

export const createStudent = async (data) => {
  // check mail ton tai chua
  const account = await findStudentByEmail(data.accountStudent.email);
  if (account) {
    throw new HttpException(404, "Email is existing");
  }

  // hash password
  const hashPassword =
    await passwordUtil.generateHashPassword(DEFAULT_PASSWORD);

  // luu vao db
  const newStudent = {
    fullName: data.fullName,
    accountStudent: {
      email: data.accountStudent.email,
      password: hashPassword,
      role: ROLES.STUDENT,
      isActive: true,
    },
  };

  // luu thong tin nhay cam thi k tra ve, thong tin khac tra ve binh thuong
  const studentNew = await db.Students.create(newStudent, {
    include: [
      {
        model: db.Account,
        as: "accountStudent",
      },
    ],
  });

  return studentNew;
  //  const updateStudent = async () => {};
};
export default {
  findStudentById,
  getStudentById,
  findStudentByEmail,
  getAllStudents,
  createStudent,
  getStudentIncludesClass,
};
