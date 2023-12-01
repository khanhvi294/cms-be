import HttpException from "../errors/httpException";
import db from "../models";
import authService from "./authService";
import { DEFAULT_PASSWORD, ROLES, resFindAll } from "../utils/const";
import passwordUtil from "../utils/password";
import ErrorMessage from "../common/errorMessage";
import competitionService from "./competitionService";
import judgeService from "./judgeService";

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

  try {
    await db.sequelize.transaction(async (t) => {
      await db.Employee.update(
        { ...data },
        { where: { id: employeeId }, transaction: t }
      );

      const employee = await db.Employee.findOne({
        where: { id: employeeId },
        nest: true,
        raw: false,
        include: [
          {
            model: db.Account,
            as: "accountEmployee",
          },
        ],
      });

      // Update the associated Account
      if (data.accountEmployee && data?.accountEmployee.email) {
        await authService.checkEmailIsExistsExceptId(
          data.accountEmployee.email,
          employee.accountEmployee.id
        );

        await db.Account.update(
          { email: data.accountEmployee.email },
          { where: { id: employee.accountEmployee.id }, transaction: t }
        );
      }
    });

    return await findEmployeeById(employeeId);
  } catch (error) {
    console.log("ERROR:: ", error);
    throw new HttpException(400, error?.message || error);
  }
};

const deleteEmployee = async (id) => {
  const haveEmployee = await findEmployeeById(id);
  if (!haveEmployee) {
    throw new HttpException(
      400,
      ErrorMessage.OBJECT_IS_NOT_EXISTING("Employee")
    );
  }
  const competitions =
    await competitionService.getAllCompetitionIncludeEmployee(id);

  if (competitions.data.length > 0) {
    throw new HttpException(
      400,
      ErrorMessage.OBJECT_CANNOT_DELETE_ADD_OTHER("employee", "competition")
    );
  }
  const judges = await judgeService.getAllJudgeIncludeEmployee(id);

  console.log(competitions);
  if (judges.data.length > 0) {
    throw new HttpException(400, ErrorMessage.OBJECT_IS_EXISTING("Judge"));
  }

  const employee = await db.Employee.destroy({
    where: {
      id: id,
    },
  });

  const account = authService.deleteAccount(haveEmployee.accountId);

  return 1;
};

const updateEmployeeByAdmin = async (data) => {
  console.log("dataaupdat ", data);
  const getEmployeeByIdPromise = getEmployeeById(data.id);
  let checkCCCDPromise;
  if (data.cccd) {
    checkCCCDPromise = checkUpdateCCCD(data.cccd, data.id);
  }

  if (data.password) {
    delete data.password;
  }

  const checkPromise = [getEmployeeByIdPromise];
  if (checkCCCDPromise) {
    checkPromise.push(checkCCCDPromise);
  }

  await Promise.all(checkPromise);

  try {
    await db.sequelize.transaction(async (t) => {
      await db.Employee.update(
        { ...data },
        { where: { id: data.id }, transaction: t }
      );

      const employeeAcc = await db.Employee.findOne({
        where: { id: data.id },
        nest: true,
        raw: false,
        include: [
          {
            model: db.Account,
            as: "accountEmployee",
          },
        ],
      });

      // Update the associated Account
      if (data.accountEmployee && data?.accountEmployee.email) {
        await authService.checkEmailIsExistsExceptId(
          data.accountEmployee.email,
          employeeAcc.accountEmployee.id
        );

        await db.Account.update(
          { ...data.accountEmployee },
          { where: { id: employeeAcc.accountEmployee.id }, transaction: t }
        );
      }
    });

    return await findEmployeeById(data.id);
  } catch (error) {
    console.log("ERROR:: ", error);
    throw new HttpException(400, error?.message || error);
  }
};

export default {
  getAllEmployees,
  createEmployee,
  getEmployeeById,
  findEmployeeById,
  getAllTeacherAddJudge,
  getEmployeeByIdIncludesAccount,
  updateEmployee,
  deleteEmployee,
  updateEmployeeByAdmin,
};
