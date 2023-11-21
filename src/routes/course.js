import courseController from "../controllers/courseController";
import { verifyEmployee } from "./verify";

import { Router } from "express";

const router = Router();

router.post("/", verifyEmployee, courseController.createCourse);
router.get("/", verifyEmployee, courseController.getAllCourses);
router.patch("/:id", verifyEmployee, courseController.updateCourse);
router.delete("/:id", verifyEmployee, courseController.deleteCourse);

export default router;
