import studentController from "../controllers/studentController";
import { verifyAdmin } from "./verify";

import { Router } from "express";

const router = Router();
router.get("/", verifyAdmin, studentController.getAllStudents);
router.post("/", verifyAdmin, studentController.createStudent);

export default router;
