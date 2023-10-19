import express from "express";
import initWebRoutes from "./routes/web.js";
import connection from "./config/connectDB.js";

require("dotenv").config(); // giup chayj dc dong process.env

let app = express();
// app.use(cors({ origin: true }));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

initWebRoutes(app);
//test connection
connection();

let port = process.env.PORT || 8080; //Port === undefined => Port = 6060

app.listen(port, () => {
  //callback
  console.log("Backend Nodejs is running on the port: " + port);
});
