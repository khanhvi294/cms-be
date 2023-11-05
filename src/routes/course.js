import courseController from "../controllers/courseController";
import { verifyAdmin } from "./verify";

import { Router } from "express";

const router = Router();

router.post("/", verifyAdmin, courseController.createCourse);
router.get("/", verifyAdmin, courseController.getAllCourses);

export default router;
