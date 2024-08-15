const dotEnv = require("dotenv");
dotEnv.config();
const morgan = require("morgan");

const express = require("express");
const donorRoutes = require("./routes/donorRoutes");
const app = express();

// middlewares
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/api/v1/donors", donorRoutes);

module.exports = app;
