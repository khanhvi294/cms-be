import {
	STATUS_CODE,
	errorValidateResponse,
	successResponse,
} from './baseController';

import authService from '../services/authService';
import classService from '../services/classService';
import competitionClassService from '../services/competitionClassService';
import competitionService from '../services/competitionService';
import competitionValidation from '../validations/competitionValidation';
import { validateData } from '../utils/validateData';
import { STATUS_COMPETITION } from '../utils/const';

const getAllCompetition = async (req, res, next) => {
	try {
		const result = await competitionService.getAllCompetition();
		successResponse(STATUS_CODE.OK, result, res);
	} catch (error) {
		next(error);
	}
};
const addClassJoin = async (req, res, next) => {
	try {
		const result = await competitionService.addClassJoin(req.body);
		successResponse(STATUS_CODE.OK, result, res);
	} catch (error) {
		next(error);
	}
};

const removeClassJoin = async (req, res, next) => {
	try {
		const result = await competitionService.removeClassJoin(req.body);
		successResponse(STATUS_CODE.OK, result, res);
	} catch (error) {
		next(error);
	}
};

const getCompetitionById = async (req, res, next) => {
	try {
		const result = await competitionService.getCompetitionById(
			req.params.id,
		);
		successResponse(STATUS_CODE.OK, result, res);
	} catch (error) {
		next(error);
	}
};

const getClassCanJoin = async (req, res, next) => {
	try {
		const result = await classService.getClassChooseJoin(
			req.params.timeStart,
		);
		successResponse(STATUS_CODE.OK, result, res);
	} catch (error) {
		next(error);
	}
};

const getClassCanJoinUpdate = async (req, res, next) => {
	try {
		const result = await competitionClassService.getClassChooseUpdate(
			req.params.id,
		);
		successResponse(STATUS_CODE.OK, result, res);
	} catch (error) {
		next(error);
	}
};

const getAllClassJoinCompetition = async (req, res, next) => {
	try {
		const result = await competitionClassService.getAllClassJoinCompetition(
			req.params.id,
		);
		successResponse(STATUS_CODE.OK, result, res);
	} catch (error) {
		next(error);
	}
};

// const getAllClassCanJoinCompetition = async (req, res, next) => {
//   try {
//     const result = await competitionClassService.getAllClassCanJoinCompetition(
//       req.params.id
//     );
//     successResponse(STATUS_CODE.OK, result, res);
//   } catch (error) {
//     next(error);
//   }
// };

const createCompetition = async (req, res, next) => {
	try {
		/*
      FORMAT
        {
          name
          maximumQuantity
          minimumQuantity
          numOfPrizes
          numberOfRound
          timeStart
          timeEnd
          competitionClass: ["1","2","3","4","5"]
        }
    */

		const err = await validateData(competitionValidation.create, req.body);
		if (err) {
			return errorValidateResponse(422, err, res);
		}

		const employee = await authService.getEmployeeByAccount(req.user.id);
		const result = await competitionService.createCompetition(
			employee.accountEmployee.id,
			req.body,
		);
		successResponse(STATUS_CODE.CREATED, result, res);
	} catch (error) {
		next(error);
	}
};

export const updateCompetition = async (req, res, next) => {
	try {
		const err = await validateData(competitionValidation.update, req.body);
		if (err) {
			return errorValidateResponse(422, err, res);
		}
		const result = await competitionService.updateCompetition(req.body);
		successResponse(STATUS_CODE.OK, result, res);
	} catch (error) {
		next(error);
	}
};

const updateStatusCompetition = async (req, res, next) => {
	try {
		/*
      FORMAT 
        {
         
        }
    */

		const result = await competitionService.updateStatusCompetition(
			req.params.id,
			req.body.statusId,
		);

		const statusId = +req.body.statusId;
		switch(statusId){
			case STATUS_COMPETITION.STARTED:
				console.log("compe started");
				await competitionService.checkConditionStartedCompetition(req.params.id)
				break;
			
			case STATUS_COMPETITION.ENDED:
				break;
			default:
				break;
		}

		successResponse(STATUS_CODE.OK, result, res);
	} catch (error) {
		next(error);
	}
};
const deleteClassCompetition = async (req, res, next) => {
	try {
		const result = await competitionClassService.deleteClassCompetition(
			req.params.competitionId,
			req.params.classId,
		);
		successResponse(STATUS_CODE.OK, result, res);
	} catch (error) {
		next(error);
	}
};
const getCompetitionResultByIdAndStudentId = async (req, res, next) => {
	try {
		const result =
			await competitionService.getCompetitionResultByIdAndStudentId(
				req.params.id,
				req.params.studentId,
			);
		successResponse(STATUS_CODE.OK, result, res);
	} catch (error) {
		next(error);
	}
};
export default {
	createCompetition,
	getAllCompetition,
	updateStatusCompetition,
	// getAllClassCanJoinCompetition,
	getClassCanJoin,
	getCompetitionById,
	getAllClassJoinCompetition,
	deleteClassCompetition,
	getClassCanJoinUpdate,
	updateCompetition,
	addClassJoin,
	removeClassJoin,
	getCompetitionResultByIdAndStudentId,
};
