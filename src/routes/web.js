import express from "express";
import authRoutes from "./auth";

const router = express.Router();

/**
 * @param {*} app : express app
 */
const initWebRoutes = (app) => {
  router.use("/auth", authRoutes);
  return app.use("/api", router);
};

export default initWebRoutes;
