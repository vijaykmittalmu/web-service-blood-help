const dotEnv = require("dotenv");
dotEnv.config();
const morgan = require("morgan");

const express = require("express");
const donorRoutes = require("./routes/donorRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();

// middlewares
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/api/v1/donors", donorRoutes);
app.use("/api/v1/auth", authRoutes);

module.exports = app;
