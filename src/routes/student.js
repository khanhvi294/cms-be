import studentController from "../controllers/studentController";
import { verifyEmployee } from "./verify";

import { Router } from "express";

const router = Router();
router.get("/", verifyEmployee, studentController.getAllStudents);
router.post("/", verifyEmployee, studentController.createStudent);

export default router;
