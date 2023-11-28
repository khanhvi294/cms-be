import competitionController from "../controllers/competitionController";
import { verifyEmployee, verifyRole } from "./verify";

import { Router } from "express";

const router = Router();

router.post("/", verifyEmployee, competitionController.createCompetition);
router.get("/", competitionController.getAllCompetition);
router.get("/:id", competitionController.getCompetitionById);

router.get(
  "/:timeStart/join",
  verifyEmployee,
  competitionController.getClassCanJoin
);

router.get(
  "/:id/classjoin",
  verifyEmployee,
  competitionController.getClassCanJoinUpdate
);

router.get(
  "/:id/allclass",
  verifyRole,
  competitionController.getAllClassJoinCompetition
);
router.patch("/:id/status", competitionController.updateStatusCompetition);

router.delete(
  "/:competitionId/class/:classId",
  verifyEmployee,
  competitionController.deleteClassCompetition
);

export default router;
