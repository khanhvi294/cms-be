import {
  successResponse,
  STATUS_CODE,
  errorValidateResponse,
} from "./baseController";
import examFormsService from "../services/examFormsService";
import { validateData } from "../utils/validateData";
import examFormValidate from "../validations/examFormValidation";

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
    const err = await validateData(examFormValidate.create, req.body);
    if (err) {
      return errorValidateResponse(422, err, res);
    }

    const result = await examFormsService.createExamForm(req.body);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const updateExamForm = async (req, res, next) => {
  console.log(req.body);
  try {
    const err = await validateData(examFormValidate.create, req.body);
    if (err) {
      return errorValidateResponse(422, err, res);
    }

    const result = await examFormsService.updateExamForm(req.body);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const deleteExamForm = async (req, res, next) => {
  try {
    const result = await examFormsService.deleteExamForm(req.params.id);
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllExamForms,
  createExamForm,
  updateExamForm,
  deleteExamForm,
};
