import express from "express";
import initWebRoutes from "./routes/web.js";
import connection from "./config/connectDB.js";
import handleError from "./middlewares/error.js";
import cors from "cors";

require("dotenv").config(); // giup chayj dc dong process.env

let app = express();
app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connection();

initWebRoutes(app);

app.get("/", (req, res) => {
  res.send("CMS server");
});

app.use(handleError);

let port = process.env.PORT || 5050; //Port === undefined => Port = 6060

app.listen(port, () => {
  //callback
  console.log("Backend Nodejs is running on the port: " + port);
});
