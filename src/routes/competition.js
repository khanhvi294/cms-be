import competitionController from "../controllers/competitionController";
import { verifyEmployee } from "./verify";

import { Router } from "express";

const router = Router();

router.post("/", verifyEmployee, competitionController.createCompetition);
router.get("/", competitionController.getAllCompetition);

export default router;
