import dashboardController from "../controllers/dashboardController";
import { verifyEmployee } from "./verify";

import { Router } from "express";

const router = Router();

router.get("/overview", verifyEmployee, dashboardController.getOverviewStudent);
router.get("/overview/all", verifyEmployee, dashboardController.getOverviewAll);

export default router;
