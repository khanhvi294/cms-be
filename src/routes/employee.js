import employeeController from "../controllers/employeeController";
import { verifyEmployee, verifyEmployeeTeacher } from "./verify";

import { Router } from "express";

const router = Router();

router.get("/", verifyEmployee, employeeController.getAllEmployees);
router.get(
  "/judges/round/:roundId",
  verifyEmployee,
  employeeController.getAllTeacherAddJudge
);
router.post("/", verifyEmployee, employeeController.createEmployee);
router.patch("/", verifyEmployeeTeacher, employeeController.updateEmployee); // employee - teacher
router.delete("/:id", verifyEmployeeTeacher, employeeController.deleteEmployee);

export default router;
