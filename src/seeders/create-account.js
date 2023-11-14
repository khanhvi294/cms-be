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
      accountEmployee: {
        fullName: "Admin ",
        cccd: "123123123",
      },
    },
    {
      email: "teacher@gmail.com",
      password: hashPassword,
      role: ROLES.EMPLOYEE,
      isActive: true,
      accountEmployee: {
        fullName: "Employee ",
        cccd: "123123123",
      },
    },
    {
      email: "student@gmail.com",
      password: hashPassword,
      role: ROLES.STUDENT,
      isActive: true,
      accountStudent: {
        fullName: "student ",
      },
    },
  ];

  await db.Account.bulkCreate(accounts, {
    include: [
      {
        model: db.Employee,
        as: "accountEmployee",
      },
      {
        model: db.Students,
        as: "accountStudent",
      },
    ],
  });
};

export default importAccounts;
