import roundController from "../controllers/roundController";
import { verifyEmployee, verifyRole } from "./verify";

import { Router } from "express";

const router = Router();
router.get("/", verifyRole, roundController.getAllRounds);
router.get(
  "/:competitionId/competition",
  roundController.getRoundsByCompetition
);
router.post("/", verifyEmployee, roundController.createRound);

router.delete("/:id", verifyEmployee, roundController.deleteRound);
export default router;
