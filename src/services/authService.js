import HttpException from "../errors/httpException";
import db from "../models";

export const authAccount = async (email, password) => {
  //   let account = await db.Account.findOne({ where: { email } });
  //   if (!account) {
  //     throw new HttpException(404, "Email hoặc mật khẩu không đúng !!!");
  //   }
  //   const isPasswordMatch = await bcrypt.compare(password, user.password);
  //   if (!isPasswordMatch) {
  //     throw new HttpException(404, "Email hoặc mật khẩu không đúng !!!");
  //   }
  //   if (!account.isActive) {
  //     throw new HttpException(
  //       422,
  //       "Tài khoản của bạn đang bị khóa, liên hệ quản trị viên để được hỗ trợ !!!"
  //     );
  //   }
  //   return user;
};

const login = (emai, password) => {};

export default { login };
