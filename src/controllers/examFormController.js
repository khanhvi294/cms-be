import { successResponse, STATUS_CODE } from "./baseController";
import examFormsService from "../services/examFormsService";

const getAllExamForms = async (req, res, next) => {
  try {
    const result = await examFormsService.getAllExamForms();
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const createExamForm = async (req, res, next) => {
  try {
    const result = await examFormsService.createExamForm(req.body);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};
export default {
  getAllExamForms,
  createExamForm,
};
