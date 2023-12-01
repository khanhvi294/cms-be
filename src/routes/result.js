import roundResultController from "../controllers/roundResultController";
import { verifyEmployee, verifyTeacher } from "./verify";

import { Router } from "express";

const router = Router();

router.patch("/", verifyTeacher, roundResultController.updateRoundResult);
router.post("/", roundResultController.getCurrentRound);

export default router;
