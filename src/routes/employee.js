import employeeController from "../controllers/employeeController";
import { verifyEmployee, verifyEmployeeTeacher, verifyTeacher } from "./verify";

import { Router } from "express";

const router = Router();

router.get("/", verifyEmployee, employeeController.getAllEmployees);
router.get(
  "/judges/round/:roundId",
  verifyEmployee,
  employeeController.getAllTeacherAddJudge
);
router.post("/", verifyEmployeeTeacher, employeeController.createEmployee);
router.patch("/", verifyEmployeeTeacher, employeeController.updateEmployee); // employee - teacher
router.patch("/byad", verifyEmployee, employeeController.updateEmployeeByAdmin);
router.delete("/:id", verifyEmployeeTeacher, employeeController.deleteEmployee);

export default router;
