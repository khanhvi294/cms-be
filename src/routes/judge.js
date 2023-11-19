import judgeController from "../controllers/judgeController";
import { verifyEmployee } from "./verify";

import { Router } from "express";

const router = Router();

router.post("/", verifyEmployee, judgeController.createJudge);
router.post("/multiple", verifyEmployee, judgeController.createJudgesForRound);
router.get("/round/:roundId", judgeController.getAllJudgeByRound);

export default router;
