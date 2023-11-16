import HttpException from "../errors/httpException";
import db from "../models";
import authService from "./authService";
import { DEFAULT_PASSWORD, ROLES, resFindAll } from "../utils/const";
import passwordUtil from "../utils/password";

export const getAllEmployees = async () => {
  const data = await db.Employee.findAll({
    raw: true,
    nest: true,
    attributes: { exclude: ["accountId"] },
    include: [
      {
        model: db.Account,
        as: "accountEmployee",
        attributes: ["email", "isActive"],
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
  console.log(data);
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
    fullName: data.fullName,
    cccd: data.CCCD,
    accountEmployee: {
      email: data.accountEmployee.email,
      password: hashPassword,
      role: ROLES.TEACHER,
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
  console.log("data re", employeeNew);
  return employeeNew;
};

export default {
  getAllEmployees,
  createEmployee,
};
