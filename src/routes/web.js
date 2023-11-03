import express from "express";

const router = express.Router();
import homeController from "../controllers/homeController.js";

/**
 * @param {*} app : express app
 */
const initWebRoutes = (app) => {
  router.get("/", homeController.handleHi);
  return app.use("/api", router);
};

export default initWebRoutes;
