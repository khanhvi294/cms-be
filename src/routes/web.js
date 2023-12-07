import express from "express";
import authRoutes from "./auth";
import courseRoutes from "./course";
import classRoutes from "./class";
import studentRoutes from "./student";
import employeeRoutes from "./employee";
import roundRoutes from "./round";
import examFormRoutes from "./examForm";
import competitionRoutes from "./competition";
import judgeRoutes from "./judge";
import registerRoutes from "./register";
import scoreRoutes from "./score";
import roundResultRoutes from "./roundResult";
import testRoutes from "./test";

const router = express.Router();

/**
 * @param {*} app : express app
 */
const initWebRoutes = (app) => {
  router.use("/auth", authRoutes);
  router.use("/courses", courseRoutes);
  router.use("/classes", classRoutes);
  router.use("/students", studentRoutes);
  router.use("/rounds", roundRoutes);
  router.use("/employees", employeeRoutes);
  router.use("/examforms", examFormRoutes);
  router.use("/competitions", competitionRoutes);
  router.use("/judges", judgeRoutes);
  router.use("/registers", registerRoutes);
  router.use("/scores", scoreRoutes);
  router.use("/roundresults", roundResultRoutes);
  router.use("/test", testRoutes);

  return app.use("/api", router);
};

export default initWebRoutes;
