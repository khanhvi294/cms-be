import HttpException from "../errors/httpException";
import db from "../models";
import authService from "./authService";
import { DEFAULT_PASSWORD, ROLES, resFindAll } from "../utils/const";
import passwordUtil from "../utils/password";
import ErrorMessage from "../common/errorMessage";

export const getAllEmployees = async () => {
  const data = await db.Employee.findAll({
    raw: true,
    nest: true,
    attributes: { exclude: ["accountId"] },
    include: [
      {
        model: db.Account,
        as: "accountEmployee",
        attributes: ["email", "isActive", "role"],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });
  return resFindAll(data);
};

export const findEmployeeByEmail = async (email) => {
  if (!email) {
    throw new HttpException(400, "Missing parameter");
  }

  const account = await authService.findAccountByEmail(email);
  return account;
};

export const createEmployee = async (data) => {
  // check mail ton tai chua
  const account = await findEmployeeByEmail(data.accountEmployee.email);
  if (account) {
    throw new HttpException(404, "Email is existing");
  }

  // hash password
  const hashPassword =
    await passwordUtil.generateHashPassword(DEFAULT_PASSWORD);

  // luu vao db
  const newEmployee = {
    ...data,
    accountEmployee: {
      email: data.accountEmployee.email,
      password: hashPassword,
      role: data.role,
      isActive: true,
    },
  };

  // luu thong tin nhay cam thi k tra ve, thong tin khac tra ve binh thuong
  const employeeNew = await db.Employee.create(newEmployee, {
    include: [
      {
        model: db.Account,
        as: "accountEmployee",
      },
    ],
  });

  return employeeNew;
};

const findEmployeeById = async (id) => {
  if (!id) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.Employee.findOne({
    where: {
      id: id,
    },
  });
  return data;
};

const getEmployeeById = async (id) => {
  if (!id) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.Employee.findOne({
    where: {
      id: id,
    },
  });

  if (!data) {
    throw new HttpException(400, ErrorMessage.OBJECT_NOT_FOUND("Employee"));
  }

  return data;
};

const getEmployeeByIdIncludesAccount = async (id) => {
  if (!id) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.Employee.findOne({
    where: {
      id: id,
    },
    raw: true,
    nest: true,
    include: [
      {
        model: db.Account,
        as: "accountEmployee",
        attributes: ["email", "isActive", "id", "role"],
      },
    ],
  });

  if (!data) {
    throw new HttpException(400, ErrorMessage.OBJECT_NOT_FOUND("Employee"));
  }

  return data;
};

// const updateEmployee = async (employee) => {
//   console.log(employee);
//   // const account = await authService.checkEmailAccountUpdate(employee.accountEmployee.email);
//   // if (account) {
//   //   throw new HttpException(404, "Email is existing");
//   // }

//   // luu vao db
//   const updateEmployee = {
//     ...data,
//     accountEmployee: {
//       email: data.accountEmployee.email,
//       password: hashPassword,
//       role: data.role,
//       isActive: true,
//     },
//   };

//   // luu thong tin nhay cam thi k tra ve, thong tin khac tra ve binh thuong
//   const employeeNew = await db.Employee.create(newEmployee, {
//     include: [
//       {
//         model: db.Account,
//         as: "accountEmployee",
//       },
//     ],
//   });
// };

export default {
  getAllEmployees,
  createEmployee,
  getEmployeeById,
  findEmployeeById,
  getEmployeeByIdIncludesAccount,
};
