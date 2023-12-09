import dashboardService from "../services/dashboardService";
import {
    successResponse,
    STATUS_CODE,
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


  export default {
    getOverviewStudent,
    getOverviewAll
  };