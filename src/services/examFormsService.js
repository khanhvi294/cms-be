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

export const createExamForm = async (data) => {
  const examForm = await findExamFormByName(data.name);
  if (examForm) {
    throw new HttpException(404, "Name is existing");
  }

  // luu vao db
  const newExamForm = {
    name: data.name,
  };

  // luu thong tin nhay cam thi k tra ve, thong tin khac tra ve binh thuong
  const examFormNew = await db.ExamForm.create(newExamForm);

  return examFormNew;
};
export const updateStudent = async () => {};

export default {
  getAllExamForms,
  createExamForm,
  updateStudent,
};
