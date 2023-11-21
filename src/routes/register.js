import registerComController from "../controllers/registerComController";
import { verifyStudent } from "./verify";

import { Router } from "express";

const router = Router();

router.get(
  "/all/student",
  verifyStudent,
  registerComController.getAllCompetitionByStudentId
);
router.post("/", verifyStudent, registerComController.registerCompetition);
router.delete("/", verifyStudent, registerComController.unRegisterCompetition);

export default router;
