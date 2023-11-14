import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";

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

export default {
  getAllEmployees,
};
