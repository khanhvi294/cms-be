import courseController from "../controllers/courseController";
import roundResultController from "../controllers/roundResultController";
import { verifyEmployee, verifyTeacher } from "./verify";

import { Router } from "express";

const router = Router();
router.patch("/", verifyTeacher, roundResultController.updateRoundResult);

router.get(
  "/round/:roundId",
  verifyTeacher,
  roundResultController.getRoundResultByRound
);

export default router;