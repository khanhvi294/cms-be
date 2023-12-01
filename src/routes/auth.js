import authController from "../controllers/authController";

import { Router } from "express";
import { verifyRole } from "./verify";

const router = Router();

router.post("/login", authController.login);
router.get("/info", verifyRole, authController.getInfo);
router.patch("/password", verifyRole, authController.changePassword);

export default router;
