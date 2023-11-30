import studentController from "../controllers/studentController";
import { verifyEmployee, verifyEmployeeStudent, verifyStudent } from "./verify";

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
router.patch("/", verifyEmployeeStudent, studentController.updateStudent);
router.delete("/:id", verifyEmployee, studentController.deleteStudent);

export default router;
