import roundController from "../controllers/roundController";
import { verifyEmployee, verifyRole } from "./verify";

import { Router } from "express";

const router = Router();
router.get("/", verifyRole, roundController.getAllRounds);
router.post("/", verifyEmployee, roundController.createRound);

export default router;
