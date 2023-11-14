import HttpException from "../errors/httpException";
import db from "../models";
import jwtUtil from "../utils/jwt";
import passwordUtil from "../utils/password";

export const authAccount = async (email, password) => {
  let account = await db.Account.findOne({ where: { email } });
  if (!account) {
    throw new HttpException(404, "Email hoặc mật khẩu không đúng !!!");
  }
  const isPasswordMatch = await passwordUtil.comparePassword(
    account.password,
    password
  );
  if (!isPasswordMatch) {
    throw new HttpException(404, "Email hoặc mật khẩu không đúng !!!");
  }
  if (!account.isActive) {
    throw new HttpException(
      422,
      "Tài khoản của bạn đang bị khóa, liên hệ quản trị viên để được hỗ trợ !!!"
    );
  }
  return account;
};

export const findAccount = async (id) => {
  let account = await db.Account.findOne({ where: { id } });
  return account;
};

export const findAccountByEmail = async (email) => {
  let account = await db.Account.findOne({ where: { email } });
  return account;
};

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

export default { login, findAccount, findAccountByEmail };
