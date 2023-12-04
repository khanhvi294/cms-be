import { verifyEmployee, verifyRole, verifyTeacher } from "./verify";
import scoreController from "../controllers/scoreController";

import { Router } from "express";

const router = Router();

router.get(
  "/roundresult/:roundResultId",
  verifyEmployee,
  scoreController.getScoreByRoundResult
);

export default router;
