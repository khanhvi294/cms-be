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
    order: [["createdAt", "DESC"]],
  });
  return resFindAll(data);
};

export const getAllTeacherAddJudge = async (roundId) => {
  const employees = await db.Employee.findAll({
    raw: true,
    nest: true,
    attributes: { exclude: ["accountId"] },
    include: [
      {
        model: db.Account,
        as: "accountEmployee",
        where: {
          role: ROLES.TEACHER,
        },
        attributes: [],
      },
      {
        model: db.Judge,
        as: "employeeJudge",
        where: {
          roundId: roundId,
        },
        required: false,
        attributes: [],
      },
    ],
    where: {
      "$employeeJudge.roundId$": null,
    },
    order: [["createdAt", "DESC"]],
  });
  return resFindAll(employees);

  // const data = await db.Employee.findAll({
  //   raw: true,
  //   nest: true,
  //   attributes: { exclude: ["accountId"] },
  //   include: [
  //     {
  //       model: db.Account,
  //       as: "accountEmployee",
  //       attributes: ["email", "isActive", "role"],
  //     },
  //   ],
  //   order: [["updatedAt", "DESC"]],
  // });
  // return resFindAll(data);
};

export const findEmployeeByEmail = async (email) => {
  if (!email) {
    throw new HttpException(400, ErrorMessage.MISSING_PARAMETER);
  }

  const account = await authService.findAccountByEmail(email);
  return account;
};

export const findEmployeeByCCCD = async (cccd) => {
  if (!cccd) {
    throw new HttpException(400, ErrorMessage.MISSING_PARAMETER);
  }

  const employee = await db.Employee.findOne({ where: { cccd } });
  return employee;
};

export const checkEmployeeByCCCD = async (cccd) => {
  const employee = await findEmployeeByCCCD(cccd);

  if (employee) {
    throw new HttpException(400, ErrorMessage.OBJECT_IS_EXISTING("CCCD"));
  }
};

export const createEmployee = async (data) => {
  // check mail ton tai chua
  const account = await findEmployeeByEmail(data.accountEmployee.email);
  if (account) {
    throw new HttpException(404, ErrorMessage.OBJECT_IS_EXISTING("Email"));
  }

  await checkEmployeeByCCCD(data.cccd);

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

const checkUpdateCCCD = async (newVal, employeeId) => {
  const employee = await findEmployeeByCCCD(newVal);

  if (employee) {
    if (employee.id != employeeId) {
      throw new HttpException(400, ErrorMessage.OBJECT_IS_EXISTING("CCCD"));
    }
  }

  return false;
};

const updateEmployee = async (employeeId, data) => {
  const getEmployeeByIdPromise = getEmployeeById(employeeId);
  let checkCCCDPromise;
  if (data.cccd) {
    checkCCCDPromise = checkUpdateCCCD(data.cccd, employeeId);
  }

  const checkPromise = [getEmployeeByIdPromise];
  if (checkCCCDPromise) {
    checkPromise.push(checkCCCDPromise);
  }

  await Promise.all(checkPromise);

  const result = await db.Employee.update(
    { ...data },
    { where: { id: employeeId } }
  ).then(async () => {
    return await findEmployeeById(employeeId);
  });

  return result;
};

export default {
  getAllEmployees,
  createEmployee,
  getEmployeeById,
  findEmployeeById,
  getAllTeacherAddJudge,
  getEmployeeByIdIncludesAccount,
  updateEmployee,
};
