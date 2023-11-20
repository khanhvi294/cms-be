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
    ...data,
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
};
//  const updateStudent = async () => {};

export const getCompetitionsForStudent = async (studentId) => {
  // Tìm học viên với studentId tương ứng
  const student = await db.Students.findOne({
    nest: true,
    raw: false,
    where: { id: studentId },
    include: [
      {
        model: db.StudentClass,
        as: "ClassStudentStudent",
        nest: true,
        raw: false,
        include: [
          {
            model: db.Class,
            as: "ClassStudentClass",
            nest: true,
            raw: false,
            include: [
              {
                model: db.CompetitionClass,
                as: "ClassCompetitionClass",
                nest: true,
                raw: false,
                include: [
                  {
                    model: db.Competition,
                    as: "competitionCompetitionClass",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  if (!student) {
    console.log("Không tìm thấy học viên");
    return [];
  }

  // Trích xuất danh sách các cuộc thi từ cấu trúc lồng nhau
  const competitions = student.ClassStudentStudent.map((studentClass) => {
    return studentClass.ClassStudentClass.ClassCompetitionClass.map(
      (competitionClass) => competitionClass.competitionCompetitionClass
    );
  });

  // Hợp nhất mảng
  const flattenedCompetitions = [].concat(...competitions);
  const uniqueCompetitions = Array.from(
    new Set(flattenedCompetitions.map((c) => c.id))
  ).map((id) => flattenedCompetitions.find((c) => c.id === id));
  return uniqueCompetitions;
};

export default {
  findStudentById,
  getStudentById,
  findStudentByEmail,
  getAllStudents,
  createStudent,
  getStudentIncludesClass,
  getCompetitionsForStudent,
};
