import express from "express";
import authRoutes from "./auth";
import courseRoutes from "./course";

const router = express.Router();

/**
 * @param {*} app : express app
 */
const initWebRoutes = (app) => {
  router.use("/auth", authRoutes);
  router.use("/courses", courseRoutes);
  return app.use("/api", router);
};

export default initWebRoutes;
