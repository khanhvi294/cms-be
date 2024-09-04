const { Sequelize } = require("sequelize");

// export const sequelize = new Sequelize("cms-db", "root", null, {
//   host: "localhost",
//   dialect: "mysql",
// });

const DB_NAME = process.env.DB_NAME || "cms-db";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_PORT = process.env.DB_PORT || "3306";

console.log("db host ", DB_HOST);

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  port: DB_PORT,
});

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default connection;
