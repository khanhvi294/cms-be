import express from "express";
import initWebRoutes from "./routes/web.js";
import connection from "./config/connectDB.js";
import handleError from "./middlewares/error.js";
import cors from "cors";
import seedsData from "./seeders";
import taskSchedule from "./cron/job.js";
require("dotenv").config(); // giup chayj dc dong process.env

let app = express();
app.use(cors({ origin: true, credentials: true })); // Enable All CORS Requests

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connection();

initWebRoutes(app);

app.get("/", (req, res) => {
  res.send("CMS server");
});

app.use(handleError);

// cron job
taskSchedule();

seedsData();

let port = process.env.PORT || 5050; //Port === undefined => Port = 6060

app.listen(port, () => {
  //callback
  console.log("Backend Nodejs is running on the port: " + port);
});
