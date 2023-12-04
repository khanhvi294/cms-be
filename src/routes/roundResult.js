import courseController from "../controllers/courseController";
import roundResultController from "../controllers/roundResultController";
import { verifyEmployee, verifyTeacher } from "./verify";

import { Router } from "express";

const router = Router();
router.patch("/", verifyTeacher, roundResultController.updateRoundResult);
router.post(
  "/check",
  verifyEmployee,
  roundResultController.checkStudentPassRound
);

router.post(
  "/confirm",
  verifyEmployee,
  roundResultController.confirmStudentPassRound
);

router.get(
  "/round/:roundId",
  verifyTeacher,
  roundResultController.getRoundResultByRound
);

router.post("/tmp", roundResultController.tmpCreateRounds);
router.get("/cur/:id", roundResultController.getCurrentRound);
router.get("/first/:id", roundResultController.getFirstRound);
router.get("/next/:id", roundResultController.getNextRound);

export default router;
