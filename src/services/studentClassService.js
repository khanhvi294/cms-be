import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";

export const getAllStudentByClass = async (classId) => {
  console.log(
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
  );
  console.log("iddd", classId);
  if (!classId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.StudentClass.findAll({
    where: { classId: classId },
    raw: true,
    nest: true,
    attributes: { exclude: ["studentId"] },
    include: [
      {
        model: db.Students,
        as: "ClassStudentStudent",
        attributes: ["fullName", "id"],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });
  console.log(data);

  return resFindAll(data);
};
export default {
  getAllStudentByClass,
};
