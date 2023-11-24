import ErrorMessage from "../common/errorMessage";
import HttpException from "../errors/httpException";
import db from "../models";
import competitionService from "../services/competitionService";
import { resFindAll } from "../utils/const";
import studentService from "./studentService";

export const findRegisterCompetition = async (data) => {
  if (!data.studentId || !data.competitionId) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const registerData = await db.Register.findOne({
    where: { studentId: data.studentId, competitionId: data.competitionId },
  });

  return registerData;
};
export const getRegisterCompetition = async (data) => {
  const registerData = await findRegisterCompetition(data);

  if (!registerData) {
    throw new HttpException(400, ErrorMessage.OBJECT_NOT_FOUND("Register"));
  }

  return registerData;
};

export const registerCompetition = async (data) => {
  /**
   * data {
   *     studentId
   *     competitionId
   *  }
   */

  // check cuoc thi co ton tai chua
  // check sv da dk chua
  const [registerComFind, competition] = await Promise.all([
    findRegisterCompetition(data),
    competitionService.getCompetitionIncludeClass(data.competitionId),
  ]);

  if (registerComFind) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM("You registed this before")
    );
  }

  // check sv thuoc lop du dieu kien tham gia khong

  const studentData = await studentService.getStudentIncludesClass(
    data.studentId
  );
  let checkCondition = false;
  for (let i = 0; i < studentData?.ClassStudentStudent.length; i++) {
    for (let j = 0; j < competition?.competitionCompetitionClass.length; j++) {
      if (
        studentData?.ClassStudentStudent[i].classId ==
        competition?.competitionCompetitionClass[j].classId
      ) {
        checkCondition = true;
        break;
      }
    }
  }

  if (!checkCondition) {
    throw new HttpException(
      400,
      ErrorMessage.CUSTOM("You cannot join this competition")
    );
  }

  const registerData = await db.Register.create(data);
  return registerData;
};

export const unRegisterCompetition = async (data) => {
  /**
   * data {
   *     studentId
   *     competitionId
   *  }
   */
  const registerComFind = await getRegisterCompetition(data);
  const result = await db.Register.destroy({
    where: { id: registerComFind.id },
  });
  return result;
};
export const getAllCompetitionByStudentId = async (studentId) => {
  const data = await db.Register.findAll({
    where: { studentId: studentId },
    order: [["createdAt", "DESC"]],
  });
  return resFindAll(data);
};

export default {
  registerCompetition,
  unRegisterCompetition,
  getAllCompetitionByStudentId,
  findRegisterCompetition,
  getRegisterCompetition,
};
