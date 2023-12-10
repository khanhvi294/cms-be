import dashboardService from "../services/dashboardService";
import { ROLES } from "../utils/const";
import { checkStartAndEnd, validateData } from "../utils/validateData";
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
      checkStartAndEnd(req.query.from, req.query.to);

      const result = await dashboardService.filterStudentByDate(req.query.from, req.query.to);
      successResponse(STATUS_CODE.OK, result, res);
    } catch (error) {
      next(error);
    }
  };

  const filterEmployeeByDate = async (req, res, next) => {
    try {
      const err = await validateData(dashboardValidation.filter, req.query);
      if (err) {
        return errorValidateResponse(422, err, res);
      }
      checkStartAndEnd(req.query.from, req.query.to);

      const result = await dashboardService.filterEmployeeByDate(req.query.from, req.query.to, ROLES.EMPLOYEE);
      successResponse(STATUS_CODE.OK, result, res);
    } catch (error) {
      next(error);
    }
  };

  const filterTeacherByDate = async (req, res, next) => {
    try {
      const err = await validateData(dashboardValidation.filter, req.query);
      if (err) {
        return errorValidateResponse(422, err, res);
      }
      checkStartAndEnd(req.query.from, req.query.to);
      const result = await dashboardService.filterEmployeeByDate(req.query.from, req.query.to, ROLES.TEACHER);
      successResponse(STATUS_CODE.OK, result, res);
    } catch (error) {
      next(error);
    }
  };


  const filterClassByDate = async (req, res, next) => {
    try {
      const err = await validateData(dashboardValidation.filter, req.query);
      if (err) {
        return errorValidateResponse(422, err, res);
      }
      checkStartAndEnd(req.query.from, req.query.to);

      const result = await dashboardService.filterClassByDate(req.query.from, req.query.to);
      successResponse(STATUS_CODE.OK, result, res);
    } catch (error) {
      next(error);
    }
  };


  const filterCourseByDate = async (req, res, next) => {
    try {
      const err = await validateData(dashboardValidation.filter, req.query);
      if (err) {
        return errorValidateResponse(422, err, res);
      }
      checkStartAndEnd(req.query.from, req.query.to);

      const result = await dashboardService.filterCourseByDate(req.query.from, req.query.to);
      successResponse(STATUS_CODE.OK, result, res);
    } catch (error) {
      next(error);
    }
  };


  const filterCompetitionByDate = async (req, res, next) => {
    try {
      const err = await validateData(dashboardValidation.filter, req.query);
      if (err) {
        return errorValidateResponse(422, err, res);
      }
      checkStartAndEnd(req.query.from, req.query.to);

      const result = await dashboardService.filterCompetitionByDate(req.query.from, req.query.to);
      successResponse(STATUS_CODE.OK, result, res);
    } catch (error) {
      next(error);
    }
  };


  export default {
    getOverviewStudent,
    getOverviewAll,
    filterStudentByDate,
    filterEmployeeByDate,
    filterTeacherByDate,
    filterClassByDate,
    filterCourseByDate,
    filterCompetitionByDate,

  };