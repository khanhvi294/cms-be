import classController from "../controllers/classController";
import { verifyEmployee } from "./verify";

import { Router } from "express";

const router = Router();

router.post("/", verifyEmployee, classController.createClass);
router.get("/", verifyEmployee, classController.getAllClasses);
router.patch("/", verifyEmployee, classController.updateClass);

export default router;
