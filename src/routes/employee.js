import employeeController from "../controllers/employeeController";
import { verifyEmployee } from "./verify";

import { Router } from "express";

const router = Router();

router.get("/", verifyEmployee, employeeController.getAllEmployees);
router.get(
  "/judges/round/:roundId",
  verifyEmployee,
  employeeController.getAllTeacherAddJudge
);
router.post("/", verifyEmployee, employeeController.createEmployee);

export default router;
