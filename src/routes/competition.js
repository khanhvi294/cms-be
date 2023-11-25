import competitionController from "../controllers/competitionController";
import { verifyEmployee } from "./verify";

import { Router } from "express";

const router = Router();

router.post("/", verifyEmployee, competitionController.createCompetition);
router.get("/", competitionController.getAllCompetition);
router.get("/:id", competitionController.getCompetitionById);
// router.get(
//   "/:id/join",
//   verifyEmployee,
//   competitionController.getAllClassCanJoinCompetition
// );
router.get(
  "/:timeStart/join",
  verifyEmployee,
  competitionController.getClassCanJoin
);
router.get(
  "/:id/allclass",
  verifyEmployee,
  competitionController.getAllClassJoinCompetition
);
router.patch("/:id/status", competitionController.updateStatusCompetition);

router.delete(
  "/:competitionId/class/:classId",
  verifyEmployee,
  competitionController.deleteClassCompetition
);

export default router;
