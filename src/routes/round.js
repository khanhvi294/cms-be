import roundController from "../controllers/roundController";
import { verifyEmployee, verifyRole, verifyTeacher } from "./verify";

import { Router } from "express";

const router = Router();
router.get("/", verifyRole, roundController.getAllRounds);
router.get("/:id", verifyTeacher, roundController.getRoundById);
router.get(
  "/:competitionId/competition",
  verifyRole,
  roundController.getRoundsByCompetition
);
router.post("/", verifyEmployee, roundController.createRound);
router.patch("/", verifyEmployee, roundController.updateRound);

router.delete("/:id", verifyEmployee, roundController.deleteRound);
router.get(
  "/already/competition/:competitionId",
  verifyEmployee,
  roundController.getRoundAlreadyStartByCompetition
);
export default router;
