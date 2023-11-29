import roundController from "../controllers/roundController";
import { verifyEmployee, verifyRole } from "./verify";

import { Router } from "express";

const router = Router();
router.get("/", verifyRole, roundController.getAllRounds);
router.get(
  "/:competitionId/competition",
  verifyRole,
  roundController.getRoundsByCompetition
);
router.post("/", verifyEmployee, roundController.createRound);
router.patch("/", verifyEmployee, roundController.updateRound);

router.delete("/:id", verifyEmployee, roundController.deleteRound);
export default router;
