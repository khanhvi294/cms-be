import examFormController from "../controllers/examFormController";
import { verifyAdmin } from "./verify";

import { Router } from "express";

const router = Router();

//router.get("/", verifyAdmin, examFormController.getAllEmployees);
router.post("/", verifyAdmin, examFormController.createExamForm);

export default router;
