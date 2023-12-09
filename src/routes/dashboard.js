import dashboardController from "../controllers/dashboardController";
import { verifyEmployee } from "./verify";

import { Router } from "express";

const router = Router();

router.get("/overview", verifyEmployee, dashboardController.getOverviewStudent);
router.get("/overview/all", verifyEmployee, dashboardController.getOverviewAll);
router.get("/filter/student", verifyEmployee, dashboardController.filterStudentByDate);
router.get("/filter/employee", verifyEmployee, dashboardController.filterEmployeeByDate);
router.get("/filter/teacher", verifyEmployee, dashboardController.filterTeacherByDate);
router.get("/filter/class", verifyEmployee, dashboardController.filterClassByDate);
router.get("/filter/course", verifyEmployee, dashboardController.filterCourseByDate);
router.get("/filter/competition", verifyEmployee, dashboardController.filterCompetitionByDate);

export default router;
