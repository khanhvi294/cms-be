import courseController from "../controllers/courseController";
import roundResultController from "../controllers/roundResultController";
import { verifyEmployee, verifyTeacher } from "./verify";

import { Router } from "express";

const router = Router();

router.get(
  "/round/:roundId",
  verifyTeacher,
  roundResultController.getRoundResultByRound
);

export default router;
