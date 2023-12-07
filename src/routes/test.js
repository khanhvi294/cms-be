import testController from "../controllers/testController";

import { Router } from "express";

const router = Router();

router.post("/", testController.testFunc)

export default router;
