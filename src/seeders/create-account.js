import db from "../models";
import passwordUtil from "../utils/password";
import { ROLES } from "../utils/const";

const createAccountSeed = async (data) => {
  const accountFind = await db.Account.findOne({
    where: { email: data.email },
  });

  if (accountFind) {
    console.log("Account with email: " + accountFind.email + " is Existed");
    return null;
  }

  return await db.Account.create(data, {
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

const importAccounts = async () => {
  const hashPassword = await passwordUtil.generateHashPassword("123123");
  const accounts = [
    {
      email: "admin@gmail.com",
      password: hashPassword,
      role: ROLES.EMPLOYEE,
      isActive: true,
      accountEmployee: {
        fullName: "Admin ",
        cccd: "123123123906",
      },
    },
    {
      email: "teacher@gmail.com",
      password: hashPassword,
      role: ROLES.TEACHER,
      isActive: true,
      accountEmployee: {
        fullName: "Employee ",
        cccd: "123123123789",
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

  const dataPromise = [];
  accounts.forEach((item) => {
    dataPromise.push(createAccountSeed(item));
  });

  await Promise.all(dataPromise);

  // await db.Account.bulkCreate(accounts, {
  //   include: [
  //     {
  //       model: db.Employee,
  //       as: "accountEmployee",
  //     },
  //     {
  //       model: db.Students,
  //       as: "accountStudent",
  //     },
  //   ],
  // });
};

export default importAccounts;
