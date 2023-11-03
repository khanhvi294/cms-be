import courseController from "../controllers/courseController";

import { Router } from "express";

const router = Router();

router.post("/", courseController.createCourse);
router.get("/", courseController.getAllCourses);

export default router;
