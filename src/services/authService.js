import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import { Op } from "sequelize";
import { ROLES } from "../utils/const";
import db from "../models";
import jwtUtil from "../utils/jwt";
import { mailService } from "./mailService";
import passwordUtil from "../utils/password";

// lazy for update db column for reset code, so we use this
const resetCodes = {};
// ex: resetCodes[email] = {code: '123456', expiredAt: 1234567890}
// ts ver
// type ResetCode = {
//   code: string,
//   expiredAt: number,
// }
// type ResetCodes = {
//   [key: string]: ResetCode,
// }

export const authAccount = async (email, password) => {
  let account = await db.Account.findOne({ where: { email } });
  if (!account) {
    throw new HttpException(400, ErrorMessage.LOGIN_FAILED);
  }
  const isPasswordMatch = await passwordUtil.comparePassword(
    account.password,
    password
  );
  if (!isPasswordMatch) {
    throw new HttpException(400, ErrorMessage.LOGIN_FAILED);
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
    throw new HttpException(400, ErrorMessage.MISSING_PARAMETER);
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
    throw new HttpException(400, "Account not found");
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
  const isPasswordMatch = await passwordUtil.comparePassword(
    account.password,
    data.password
  );
  if (!isPasswordMatch) {
    throw new HttpException(400, ErrorMessage.PASSWORD_IS_INCORRECT);
  }
  const hashPassword = await passwordUtil.generateHashPassword(
    data.newPassword
  );

  const upPass = await db.Account.update(
    {
      password: hashPassword,
    },
    {
      where: { id: accountId },
    }
  );

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
  forgotPassword,
  resetPassword,
};
