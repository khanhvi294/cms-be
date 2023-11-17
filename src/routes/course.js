import courseController from "../controllers/courseController";
import { verifyEmployee } from "./verify";

import { Router } from "express";

const router = Router();

router.post("/", verifyEmployee, courseController.createCourse);
router.get("/", verifyEmployee, courseController.getAllCourses);
router.patch("/", verifyEmployee, courseController.updateCourse);

export default router;
