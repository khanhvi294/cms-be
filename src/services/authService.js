import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import db from "../models";
import { ROLES } from "../utils/const";
import jwtUtil from "../utils/jwt";
import passwordUtil from "../utils/password";
import { Op } from "sequelize";

export const authAccount = async (email, password) => {
  let account = await db.Account.findOne({ where: { email } });
  if (!account) {
    throw new HttpException(404, ErrorMessage.LOGIN_FAILED);
  }
  const isPasswordMatch = await passwordUtil.comparePassword(
    account.password,
    password
  );
  if (!isPasswordMatch) {
    throw new HttpException(404, ErrorMessage.LOGIN_FAILED);
  }
  if (!account.isActive) {
    throw new HttpException(
      422,
      "Tài khoản của bạn đang bị khóa, liên hệ quản trị viên để được hỗ trợ !!!"
    );
  }
  return account;
};

export const checkEmailIsExistsExceptId = async (email, id) => {
  if (!email || !id) {
    throw new HttpException(404, ErrorMessage.MISSING_PARAMETER);
  }

  const account = await db.Account.findOne({
    where: { email: email, id: { [Op.ne]: id } },
  });

  if (account) {
    throw new HttpException(422, ErrorMessage.EMAIL_IS_EXISTING);
  }
  return false;
};

export const findAccount = async (id) => {
  let account = await db.Account.findOne({ where: { id } });
  return account;
};

export const getStudentByAccount = async (id) => {
  const student = await db.Account.findOne({
    where: { id },
    raw: true,
    nest: true,
    attributes: { exclude: ["accountId", "password"] },
    include: [
      {
        model: db.Students,
        as: "accountStudent",
        attributes: [
          "id",
          "fullName",
          "gender",
          "dateOfBirth",
          "address",
          "phone",
        ],
      },
    ],
  });
  return student;
};

export const getEmployeeByAccount = async (id) => {
  const employee = await db.Account.findOne({
    where: { id },
    raw: true,
    nest: true,
    attributes: { exclude: ["accountId", "password"] },
    attributes: ["id", "email", "role"],
    include: [
      {
        model: db.Employee,
        as: "accountEmployee",
        attributes: [
          "id",
          "fullName",
          "cccd",
          "gender",
          "dateOfBirth",
          "address",
          "phone",
        ],
      },
    ],
  });

  return employee;
};

export const getInfo = async (id) => {
  const account = await findAccount(id);
  if (!account) {
    throw new HttpException(422, "Account is not exits");
  }
  if (account.role == ROLES.STUDENT) {
    return getStudentByAccount(id);
  }
  return getEmployeeByAccount(id);
};

export const findAccountByEmail = async (email) => {
  let account = await db.Account.findOne({ where: { email } });
  return account;
};

export const findAccountById = async (id) => {
  let account = await db.Account.findOne({ where: { id } });
  return account;
};

// export const checkEmailAccountUpdate = async (account) => {
//   let account = await db.Account.findOne({
//     where: { email: account.email, id: { [Op.ne]: account.id } },
//   });
//   return account;
// };

export const getAccountByEmail = async (email) => {
  const account = await findAccountByEmail(email);
  if (!account) {
    throw new HttpException(404, "Account not found");
  }
};

const login = async (email, password) => {
  const account = await authAccount(email, password);

  const token = await jwtUtil.generateToken({ id: account.id });
  return { token };
};

const deleteAccount = async (id) => {
  const haveAccount = await findAccount(id);
  if (!haveAccount) {
    throw new HttpException(
      400,
      ErrorMessage.OBJECT_IS_NOT_EXISTING("Account")
    );
  }
  const account = await db.Account.destroy({
    where: {
      id: id,
    },
  });

  return account;
};

export const changePassword = async (data, accountId) => {
  const account = await findAccountById(accountId);
  const password = await passwordUtil.generateHashPassword(data.password);
  const isPasswordMatch = await passwordUtil.comparePassword(
    account.password,
    password
  );
  if (!isPasswordMatch) {
    throw new HttpException(404, ErrorMessage.PASSWORD_IS_INCORRECT);
  }
  const hashPassword = await passwordUtil.generateHashPassword(data.newPassword);

  const upPass = await db.Account.update(hashPassword, {
    where: { id: accountId },
  });
  return upPass;
};

export default {
  login,
  findAccount,
  findAccountByEmail,
  getInfo,
  getEmployeeByAccount,
  getStudentByAccount,
  deleteAccount,
  checkEmailIsExistsExceptId,
  changePassword,
};
