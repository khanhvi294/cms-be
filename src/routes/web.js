import express from "express";

const router = express.Router();
import homeController from "../controllers/homeController.js";
import loginController from "../controllers/loginController.js";

/**
 * @param {*} app : express app
 */
const initWebRoutes = (app) => {
  router.get("/", homeController.handleHi);
  router.post("/login", loginController.handleLogin);
  return app.use("/api", router);
};

export default initWebRoutes;
