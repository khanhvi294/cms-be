import competitionController from "../controllers/competitionController";
import { verifyEmployee } from "./verify";

import { Router } from "express";

const router = Router();

router.post("/", verifyEmployee, competitionController.createCompetition);
router.get("/", competitionController.getAllCompetition);
// router.get(
//   "/:id/join",
//   verifyEmployee,
//   competitionController.getAllClassCanJoinCompetition
// );
router.get("/:timeStart/join", verifyEmployee, competitionController.getClass);
router.patch("/:id/status", competitionController.updateStatusCompetition);

export default router;
