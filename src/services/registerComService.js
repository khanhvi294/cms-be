import { STATUS_COMPETITION, calculateDistanceFromDate, resFindAll } from '../utils/const';

import ErrorMessage from '../common/errorMessage';
import HttpException from '../errors/httpException';
import competitionService from '../services/competitionService';
import db from '../models';
import studentService from './studentService';

export const findRegisterCompetition = async (data) => {
	if (!data.studentId || !data.competitionId) {
		throw new HttpException(422, ErrorMessage.MISSING_PARAMETER);
	}

	const registerData = await db.Register.findOne({
		where: { studentId: data.studentId, competitionId: data.competitionId },
	});

	return registerData;
};

export const getRegisterCompetition = async (data) => {
	const registerData = await findRegisterCompetition(data);

	if (!registerData) {
		throw new HttpException(400, ErrorMessage.OBJECT_NOT_FOUND('Register'));
	}

	return registerData;
};

export const getRegisterByCompetition = async (competitionId) => {
	const register = await db.Register.findAll({
		where: { competitionId },
		raw: true,
		nest: true,
		attributes: { exclude: ['studentId'] },
		include: [
			{
				model: db.Students,
				as: 'studentRegister',
				attributes: ['fullName', 'id'],
				raw: true,
				nest: true,
				include: [
					{
						model: db.Account,
						as: 'accountStudent',
						attributes: ['email'],
					},
				],
			},
		],
		order: [['createdAt', 'DESC']],
	});
	return resFindAll(register);
};

export const registerCompetition = async (data) => {
	/**
	 * data {
	 *     studentId
	 *     competitionId
	 *  }
	 */

	// check cuoc thi co ton tai chua
	// check sv da dk chua
	const [registerComFind, competition] = await Promise.all([
		findRegisterCompetition(data),
		competitionService.getCompetitionIncludeClass(data.competitionId),
	]);

	// check cuoc thi da bat dau chua
	if (
		competition.status !== STATUS_COMPETITION.CREATED ||
		calculateDistanceFromDate(new Date(), competition.timeStart) <= 2
	) {
		throw new HttpException(
			400,
			ErrorMessage.CUSTOM(
				'Competition is already started, cannot do this',
			),
		);
	}

	// check toi thieu 2 ngay

	if (registerComFind) {
		throw new HttpException(
			400,
			ErrorMessage.CUSTOM('You registed this before'),
		);
	}

	// check sv thuoc lop du dieu kien tham gia khong

	const studentData = await studentService.getStudentIncludesClass(
		data.studentId,
	);
	let checkCondition = false;
	for (let i = 0; i < studentData?.ClassStudentStudent.length; i++) {
		for (
			let j = 0;
			j < competition?.competitionCompetitionClass.length;
			j++
		) {
			if (
				studentData?.ClassStudentStudent[i].classId ==
				competition?.competitionCompetitionClass[j].classId
			) {
				checkCondition = true;
				break;
			}
		}
	}

	if (!checkCondition) {
		throw new HttpException(
			400,
			ErrorMessage.CUSTOM('You cannot join this competition'),
		);
	}

	const registerData = await db.Register.create(data);
	return registerData;
};

export const unRegisterCompetition = async (data) => {
	/**
	 * data {
	 *     studentId
	 *     competitionId
	 *  }
	 */
	const registerComFind = await getRegisterCompetition(data);

	const competition = await competitionService.getCompetitionById(
		registerComFind.competitionId,
	);

	// check cuoc thi da bat dau chua
	if (
		competition.status !== STATUS_COMPETITION.CREATED ||
		new Date(competition.timeStart) <= new Date()
	) {
		throw new HttpException(
			400,
			ErrorMessage.CUSTOM(
				'Competition is already started, cannot do this',
			),
		);
	}

	const result = await db.Register.destroy({
		where: { id: registerComFind.id },
	});
	return result;
};
export const getAllCompetitionByStudentId = async (studentId) => {
	const data = await db.Register.findAll({
		where: { studentId: studentId },
		raw: true,
		nest: true,
		attributes: { exclude: ['competitionId'] },
		include: [
			{
				model: db.Competition,
				as: 'competitionRegister',
			},
		],
		order: [['createdAt', 'DESC']],
	});
	return resFindAll(data);
};

export default {
	registerCompetition,
	unRegisterCompetition,
	getAllCompetitionByStudentId,
	findRegisterCompetition,
	getRegisterCompetition,
	getRegisterByCompetition,
};
