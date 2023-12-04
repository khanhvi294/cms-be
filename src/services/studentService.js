import HttpException from "../errors/httpException";
import db from "../models";
import { DEFAULT_PASSWORD, ROLES, resFindAll } from "../utils/const";
import authService from "./authService";
import passwordUtil from "../utils/password";
import ErrorMessage from "../common/errorMessage";
import studentClassService from "./studentClassService";

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
    order: [["createdAt", "DESC"]],
  });

  return resFindAll(data);
};

const getStudentAddClass = async (classId) => {
  const students = await db.Students.findAll({
    raw: true,
    nest: true,
    include: [
      {
        model: db.StudentClass,
        as: "ClassStudentStudent",
        where: {
          classId: classId,
        },
        required: false,
        attributes: [],
      },
    ],
    where: {
      "$ClassStudentStudent.classId$": null,
    },
    order: [["createdAt", "DESC"]],
  });

  return students;
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
    throw new HttpException(
      400,
      ErrorMessage.OBJECT_IS_NOT_EXISTING("Student")
    );
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

// export const updateStudent = async (studentId, data) => {
//   const getStudentByIdPromise = getStudentById(studentId);

//   const checkPromise = [getStudentByIdPromise];

//   await Promise.all(checkPromise);

//   const result = await db.Students.update(
//     { ...data },
//     { where: { id: studentId } }
//   ).then(async () => {
//     return await findStudentById(studentId);
//   });

//   return result;
// };

export const updateStudent = async (studentId, data) => {
  const getStudentByIdPromise = getStudentById(studentId);

  const checkPromise = [getStudentByIdPromise];

  await Promise.all(checkPromise);

  try {
    // Start a new transaction
   const student = await db.sequelize.transaction(async (t) => {
      // First, update the Student
      await db.Students.update(
        { ...data },
        { where: { id: studentId }, transaction: t }
      );

      const student = await db.Students.findOne({
        where: { id: studentId },
        nest: true,
        raw: false,
        include: [
          {
            model: db.Account,
            as: "accountStudent",
          },
        ],
      });

      // Update the associated Account
      if (data.accountStudent && data?.accountStudent.email) {
        await authService.checkEmailIsExistsExceptId(
          data.accountStudent.email,
          student.accountStudent.id
        );

        await db.Account.update(
          { email: data.accountStudent.email },
          { where: { id: student.accountStudent.id }, transaction: t }
        );
      }

      // Finally, return the updated Student
      return student;
    });
    return await authService.getStudentByAccount(student.accountStudent.id);

  } catch (error) {
    console.log("ERROR:: ", error);
    throw new HttpException(400, error?.message || error);
  }
};

const deleteStudent = async (id) => {
  const haveStudent = await findStudentById(id);
  console.log(id);
  if (!haveStudent) {
    throw new HttpException(
      400,
      ErrorMessage.OBJECT_IS_NOT_EXISTING("Student")
    );
  }
  const classStudent = await studentClassService.getAllClassesByStudent(id);

  if (classStudent?.data.length > 0) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM("Student already add to class. Can't remove it")
    );
  }

  const student = await db.Students.destroy({
    where: {
      id: id,
    },
  });

  const account = authService.deleteAccount(haveStudent.accountId);

  return student;
};

export default {
  findStudentById,
  getStudentById,
  findStudentByEmail,
  getAllStudents,
  createStudent,
  getStudentIncludesClass,
  getCompetitionsForStudent,
  getStudentAddClass,
  updateStudent,
  deleteStudent,
};
