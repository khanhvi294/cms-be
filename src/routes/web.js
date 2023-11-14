import express from "express";
import authRoutes from "./auth";
import courseRoutes from "./course";
import classRoutes from "./class";
import studentRoutes from "./student";
import employeeRoutes from "./employee";

const router = express.Router();

/**
 * @param {*} app : express app
 */
const initWebRoutes = (app) => {
  router.use("/auth", authRoutes);
  router.use("/courses", courseRoutes);
  router.use("/classes", classRoutes);
  router.use("/students", studentRoutes);
  router.use("/employees", employeeRoutes);

  return app.use("/api", router);
};

export default initWebRoutes;
