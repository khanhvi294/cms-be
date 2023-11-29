import judgeController from "../controllers/judgeController";
import { verifyEmployee, verifyTeacher } from "./verify";

import { Router } from "express";

const router = Router();

router.post("/", verifyEmployee, judgeController.createJudge);
router.post("/multiple", verifyEmployee, judgeController.createJudgesForRound);
router.get("/round/:roundId", judgeController.getAllJudgeByRound);
router.get(
  "/:judgeId/rounds",
  verifyTeacher,
  judgeController.getAllRoundByJudge
);
router.delete(
  "/:roundId/employee/:employeeId",
  verifyEmployee,
  judgeController.deleteJudgeInRound
);

export default router;
