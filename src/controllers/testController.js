import { calculateDistanceFromDate } from "../utils/const";
import { STATUS_CODE, successResponse } from "./baseController";

const testFunc = async (req, res, next) => {
    try {
    
        let result = {
            "result": calculateDistanceFromDate(new Date(), "2023-12-18")
        }
  
      successResponse(STATUS_CODE.OK, result, res);
    } catch (error) {
      next(error);
    }
  };

  
export default {
    testFunc
}