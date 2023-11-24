import studentController from "../controllers/studentController";
import { verifyEmployee, verifyStudent } from "./verify";

import { Router } from "express";

const router = Router();
router.get("/", verifyEmployee, studentController.getAllStudents);
router.get(
  "/class/:classId",
  verifyEmployee,
  studentController.getStudentAddClass
);

router.get(
  "/:id/classes",
  verifyStudent,
  studentController.getAllClassesByStudent
);
router.get(
  "/:id/competitions",
  verifyStudent,
  studentController.getCompetitionsForStudent
);
router.post("/", verifyEmployee, studentController.createStudent);

export default router;
