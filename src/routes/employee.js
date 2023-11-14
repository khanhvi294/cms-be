import employeeController from "../controllers/employeeController";
import { verifyAdmin } from "./verify";

import { Router } from "express";

const router = Router();

router.get("/", verifyAdmin, employeeController.getAllEmployees);

export default router;
