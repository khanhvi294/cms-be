import judgeController from "../controllers/judgeController";
import { verifyEmployee } from "./verify";

import { Router } from "express";

const router = Router();

router.post("/", verifyEmployee, judgeController.createJudge);
router.post("/multiple", verifyEmployee, judgeController.createJudgesForRound);
router.get("/round/:roundId", judgeController.getAllJudgeByRound);
router.delete(
  "/:roundId/employee/:employeeId",
  verifyEmployee,
  judgeController.deleteJudgeInRound
);

export default router;
