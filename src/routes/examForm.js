import examFormController from "../controllers/examFormController";
import { verifyEmployee } from "./verify";

import { Router } from "express";

const router = Router();

router.get("/", verifyEmployee, examFormController.getAllExamForms);
router.post("/", verifyEmployee, examFormController.createExamForm);
router.patch("/:id", verifyEmployee, examFormController.updateExamForm);
router.delete("/:id", verifyEmployee, examFormController.deleteExamForm);

export default router;
