import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";

export const findExamFormByName = async (name) => {
  if (!name) {
    throw new HttpException(400, "Missing parameter");
  }

  const examForm = await db.ExamForm.findOne({ where: { name } });
  return examForm;
};

export const getAllExamForms = async () => {
  const data = await db.ExamForm.findAll({
    order: [["updatedAt", "DESC"]],
  });
  return resFindAll(data);
};

export const createRound = async (data) => {
  //   const round = await findExamFormByName(data.name);
  //   if (round) {
  //     throw new HttpException(404, "Name is existing");
  //   }

  // luu vao db
  const newRound = {
    time: data.time,
    exam: data.exam,
    examFormId: data.examFormId,
    competitionId: data.competitionId,
    roundNumber: data.roundNumber,
    floorPoint: data.floorPoint,
    timeStart: data.timeStart,
  };

  // luu thong tin nhay cam thi k tra ve, thong tin khac tra ve binh thuong
  const roundNew = await db.Round.create(newRound);

  return roundNew;
};

export const updateStudent = async () => {};

export default {
  getAllExamForms,
  createRound,
  updateStudent,
};
