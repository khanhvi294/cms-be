import employeeController from "../controllers/employeeController";
import { verifyEmployee, verifyEmployeeTeacher } from "./verify";

import { Router } from "express";

const router = Router();

router.get("/", verifyEmployee, employeeController.getAllEmployees);
router.post("/", verifyEmployee, employeeController.createEmployee);
router.patch("/", verifyEmployeeTeacher, employeeController.updateEmployee); // employee - teacher

export default router;
