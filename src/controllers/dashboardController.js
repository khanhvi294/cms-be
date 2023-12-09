import dashboardService from "../services/dashboardService";
import { validateData } from "../utils/validateData";
import dashboardValidation from "../validations/dashboardValidation";
import {
    successResponse,
    STATUS_CODE,
    errorValidateResponse,
  } from "./baseController";

const getOverviewStudent = async (req, res, next) => {
    try {
      const result = await dashboardService.getOverviewModel();
      successResponse(STATUS_CODE.OK, result, res);
    } catch (error) {
      next(error);
    }
  };

  const getOverviewAll = async (req, res, next) => {
    try {
      const result = await dashboardService.getOerviewAll();
      successResponse(STATUS_CODE.OK, result, res);
    } catch (error) {
      next(error);
    }
  };

  const filterStudentByDate = async (req, res, next) => {
    try {
      const err = await validateData(dashboardValidation.filter, req.query);
      if (err) {
        return errorValidateResponse(422, err, res);
      }
      const result = await dashboardService.filterStudentByDate(req.query.from, req.query.to);
      successResponse(STATUS_CODE.OK, result, res);
    } catch (error) {
      next(error);
    }
  };


  export default {
    getOverviewStudent,
    getOverviewAll,
    filterStudentByDate
  };