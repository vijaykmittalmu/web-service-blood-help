const dotEnv = require("dotenv");
dotEnv.config();
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const express = require("express");

// Routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// controller
const errorController = require("./controllers/errorController");

// utils
const AppError = require("./utils/appError");
const app = express();

// middlewares

// Set security HTTP headers
app.use(helmet());

// Body parser, reading data from body into req.body
app.use(express.json());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: `<h3>Too many request from this IP, Please try again in an hour</h3>`,
});

// Limit requests from same API
app.use("/api", limiter);

// routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/reviews", reviewRoutes);

// error handler
app.all("*", (req, res, next) => {
  next(new AppError(`can not find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
