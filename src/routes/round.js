import roundController from "../controllers/roundController";
import { verifyAdmin } from "./verify";

import { Router } from "express";

const router = Router();
router.get("/", verifyAdmin, roundController.getAllRounds);
router.post("/", verifyAdmin, roundController.createRound);

export default router;
