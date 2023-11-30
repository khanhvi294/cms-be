const { Sequelize } = require("sequelize");

export const sequelize = new Sequelize("cms-db", "root", null, {
  host: "localhost",
  dialect: "mysql",
});

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
