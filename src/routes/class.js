import classController from "../controllers/classController";
import { verifyEmployee } from "./verify";

import { Router } from "express";

const router = Router();

router.post("/", verifyEmployee, classController.createClass);
router.post("/student/add", verifyEmployee, classController.addStudent);
router.post(
  "/student/add/multiple",
  verifyEmployee,
  classController.addMultipleStudent
);
router.get("/", verifyEmployee, classController.getAllClasses);
router.get("/students", verifyEmployee, classController.getAllStudentByClass);
router.patch("/", verifyEmployee, classController.updateClass);

export default router;
