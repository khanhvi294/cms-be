import competitionController from "../controllers/competitionController";
import { verifyEmployee, verifyRole } from "./verify";

import { Router } from "express";

const router = Router();

router.post("/class/add", verifyEmployee, competitionController.addClassJoin);
// router.post(
//   "/class/remove",
//   verifyEmployee,
//   competitionController.removeClassJoin
// );
router.patch("/", verifyEmployee, competitionController.updateCompetition);
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
