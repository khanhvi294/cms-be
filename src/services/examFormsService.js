import HttpException from "../errors/httpException";
import db from "../models";
import { DEFAULT_PASSWORD, ROLES, resFindAll } from "../utils/const";
import authService from "./authService";
import passwordUtil from "../utils/password";

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

export const findExamFormByName = async (name) => {
  if (!name) {
    throw new HttpException(400, "Missing parameter");
  }

  const examForm = await db.ExamForm.findOne({ where: { name } });
  return examForm;
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
  console.log("serrrrrrrrrrrrrrrrr", data);
  return resFindAll(data);
};

export const createExamForm = async (data) => {
  console.log("hhhhh", data);
  const examForm = await findExamFormByName(data.name);
  if (examForm) {
    throw new HttpException(404, "Name is existing");
  }

  // luu vao db
  const newExamForm = {
    name: data.name,
  };

  // luu thong tin nhay cam thi k tra ve, thong tin khac tra ve binh thuong
  await db.ExamForm.create(newExamForm);

  return "Tao tai khoan thanh cong";
};
export const updateStudent = async () => {};

export default {
  findStudentById,
  getStudentById,
  // findStudentByEmail,
  getAllStudents,
  createExamForm,
  updateStudent,
};
