const { Sequelize } = require("sequelize");

const DB_NAME = process.env.DB_NAME || "cms-db";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || "3306";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || null;

console.log("DB info", DB_NAME, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD);

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
  port: DB_PORT,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// export const sequelize = new Sequelize("cms-db", "root", null, {
//   host: "localhost",
//   dialect: "mysql",
// });

// const sequelize = new Sequelize("cms-db", "root", "abc", {
//   host: "localhost",
//   dialect: "mysql",
//   port: 33065
// });

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default connection;
