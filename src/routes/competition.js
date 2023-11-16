import competitionController from "../controllers/competitionController";
import { verifyAdmin } from "./verify";

import { Router } from "express";

const router = Router();

router.post("/", verifyAdmin, competitionController.createCompetition);
router.get("/", competitionController.getAllCompetition);

export default router;
