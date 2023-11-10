import classController from "../controllers/classController";
import { verifyAdmin } from "./verify";

import { Router } from "express";

const router = Router();

router.post("/", verifyAdmin, classController.createClass);
// router.get("/", verifyAdmin, courseController.getAllCourses);
// router.patch("/", verifyAdmin, courseController.updateCourse);

export default router;
