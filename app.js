const dotEnv = require("dotenv");
dotEnv.config();
const morgan = require("morgan");

const express = require("express");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();

// middlewares
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

module.exports = app;
