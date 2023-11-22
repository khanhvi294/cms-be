import { Op } from "sequelize";
import HttpException from "../errors/httpException";
import db from "../models";
import { resFindAll } from "../utils/const";
import roundService from "./roundService";

export const findExamFormByName = async (name) => {
  if (!name) {
    throw new HttpException(400, "Missing parameter");
  }

  const examForm = await db.ExamForm.findOne({ where: { name } });
  return examForm;
};

export const findExamFormById = async (id) => {
  if (!id) {
    throw new HttpException(400, "Missing parameter");
  }

  const examForm = await db.ExamForm.findOne({ where: { id } });
  return examForm;
};

export const findExamFormByNameUpdate = async (examFormI) => {
  if (!examFormI) {
    throw new HttpException(400, "Missing parameter");
  }

  const examForm = await db.ExamForm.findOne({
    where: { name: examFormI.name, id: { [Op.ne]: examFormI.id } },
  });
  return examForm;
};

export const getExamFormById = async (id) => {
  if (!id) {
    throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
  }

  const data = await db.ExamForm.findOne({
    where: {
      id: id,
    },
  });

  if (!data) {
    throw new HttpException(400, ErrorMessage.OBJECT_NOT_FOUND("ExamForm"));
  }

  return data;
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
const updateExamForm = async (data) => {
  console.log(data);
  const examForm = await findExamFormByNameUpdate(data);
  if (examForm) {
    throw new HttpException(404, "Name is existing");
  }

  const examFormUp = await db.ExamForm.update(data, {
    where: { id: data.id },
  });

  return examFormUp;
};

const deleteExamForm = async (id) => {
  const haveExam = await findExamFormById(id);
  if (!haveExam) {
    throw new HttpException(400, ErrorMessage.OBJECT_IS_NOT_EXISTING("Class"));
  }

  const rounds = await roundService.getRoundsByExamForm(id);

  if (rounds.data.length > 0) {
    throw new HttpException(400, ErrorMessage.OBJECT_IS_EXISTING("Students"));
  }

  const deleteExamForm = await db.ExamForm.destroy({
    where: {
      id: id,
    },
  });

  return deleteExamForm;
};

export default {
  getAllExamForms,
  createExamForm,
  getExamFormById,
  updateExamForm,
  deleteExamForm,
  findExamFormById,
};
