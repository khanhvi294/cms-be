import {
  successResponse,
  STATUS_CODE,
  errorValidateResponse,
} from "./baseController";
import registerComService from "../services/registerComService";
import authService from "../services/authService";

const registerCompetition = async (req, res, next) => {
  try {
    /**
     * data {
     *     studentId
     *     competitionId
     *  }
     */
    console.log("vooooooooooooooooooooooooooooooooooooooooooooooooo");
    const student = await authService.getStudentByAccount(req.user.id);

    const result = await registerComService.registerCompetition({
      studentId: student?.accountStudent.id || -1,
      competitionId: req.body.competitionId,
    });

    return successResponse(STATUS_CODE.CREATED, result, res);
  } catch (error) {
    return next(error);
  }
};

const getAllCompetitionByStudentId = async (req, res, next) => {
  try {
    const student = await authService.getStudentByAccount(req.user.id);

    const result = await registerComService.getAllCompetitionByStudentId(
      student?.accountStudent.id || -1
    );
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};

const unRegisterCompetition = async (req, res, next) => {
  try {
    //   const err = await validateData(examFormValidate.create, req.body);
    //   if (err) {
    //     return errorValidateResponse(422, err, res);
    //   }
    const student = await authService.getStudentByAccount(req.user.id);

    const result = await registerComService.unRegisterCompetition({
      studentId: student?.accountStudent.id || -1,
      competitionId: req.params.competitionId,
    });
    successResponse(STATUS_CODE.OK, result, res);
  } catch (error) {
    next(error);
  }
};
export default {
  registerCompetition,
  unRegisterCompetition,
  getAllCompetitionByStudentId,
};
