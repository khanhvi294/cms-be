import classController from "../controllers/classController";
import { verifyAdmin } from "./verify";

import { Router } from "express";

const router = Router();

router.post("/", verifyAdmin, classController.createClass);
router.get("/", verifyAdmin, classController.getAllClasses);
router.patch("/", verifyAdmin, classController.updateClass);

export default router;
