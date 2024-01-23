const { Sequelize } = require("sequelize");
require("dotenv").config();

// const sequelize = new Sequelize("postgres://admin:admin@localhost:5432/todos");
const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    // use when running api in container
    host: "host.docker.internal",
    // use when running api on local machine
    // host: "localhost",
    port: 25432,
    dialect: "postgres",
  }
);
// test the connection
try {
  sequelize.authenticate();
  console.log("Authenticated Successfully.");
} catch (error) {
  console.error("Unable to authenticate to the database:", error);
}

module.exports = sequelize;
