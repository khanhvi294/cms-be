import express from "express";

const router = express.Router();
import homeController from "./controller/homeController";

/**
 * @param {*} app : express app
 */
const initRouters = (app) => {
  router.get("/", homeController.handleHi());
  return app.use("/", router);
};

export default initRouters;
