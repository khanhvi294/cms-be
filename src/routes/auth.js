import { Router } from 'express';
import authController from '../controllers/authController';
import { verifyRole } from './verify';

const router = Router();

router.post('/login', authController.login);
router.get('/info', verifyRole, authController.getInfo);
router.patch('/password', verifyRole, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export default router;
