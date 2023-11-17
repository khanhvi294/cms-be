import examFormController from "../controllers/examFormController";
import { verifyEmployee } from "./verify";

import { Router } from "express";

const router = Router();

router.get("/", verifyEmployee, examFormController.getAllExamForms);
router.post("/", verifyEmployee, examFormController.createExamForm);

export default router;
