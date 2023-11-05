import db from "../models";
import passwordUtil from "../utils/password";
import { ROLES } from "../utils/const";

const importAccounts = async () => {
  const hashPassword = await passwordUtil.generateHashPassword("123123");
  const accounts = [
    {
      email: "admin@gmail.com",
      password: hashPassword,
      role: ROLES.ADMIN,
      isActive: true,
      Employee: {
        fullName: "Admin ",
        cccd: "123123123",
      },
    },
    {
      email: "teacher@gmail.com",
      password: hashPassword,
      role: ROLES.EMPLOYEE,
      isActive: true,
      Employee: {
        fullName: "Employee ",
        cccd: "123123123",
      },
    },
    {
      email: "student@gmail.com",
      password: hashPassword,
      role: ROLES.STUDENT,
      isActive: true,
      Student: {
        fullName: "student ",
      },
    },
  ];

  await db.Account.bulkCreate(accounts, {
    include: [db.Employee, db.Students],
  });
};

export default importAccounts;
