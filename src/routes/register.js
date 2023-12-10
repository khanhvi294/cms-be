import { verifyEmployee, verifyRole, verifyStudent } from './verify';

import { Router } from 'express';
import registerComController from '../controllers/registerComController';

const router = Router();

router.get(
	'/all/student',
	verifyStudent,
	registerComController.getAllCompetitionByStudentId,
);
router.post('/', verifyStudent, registerComController.registerCompetition);
router.delete(
	'/:competitionId',
	verifyStudent,
	registerComController.unRegisterCompetition,
);
router.get(
	'/competition/:competitionId',
	verifyRole,
	registerComController.getRegisterByCompetition,
);

export default router;
