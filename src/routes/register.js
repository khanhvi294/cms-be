import registerComController from "../controllers/registerComController";
import { verifyEmployee, verifyStudent } from "./verify";

import { Router } from "express";

const router = Router();

router.get(
  "/all/student",
  verifyStudent,
  registerComController.getAllCompetitionByStudentId
);
router.post("/", verifyStudent, registerComController.registerCompetition);
router.delete(
  "/:competitionId",
  verifyStudent,
  registerComController.unRegisterCompetition
);
router.get(
  "/competition/:competitionId",
  verifyEmployee,
  registerComController.getRegisterByCompetition
);

export default router;
