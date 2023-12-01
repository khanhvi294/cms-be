import { verifyEmployee, verifyRole, verifyTeacher } from "./verify";
import scoreController from "../controllers/scoreController";

import { Router } from "express";

const router = Router();

router.post("/round", verifyTeacher, scoreController.createScoreOnRound);

export default router;
