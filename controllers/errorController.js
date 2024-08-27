const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((err) => err.message);
  const message = `Invalid input data : ${errors.join(" ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    errorCode: err.statusCode,
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      errorCode: err.statusCode,
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(`Error : ${err}`);

    res.status(err.statusCode).json({
      errorCode: 500,
      status: "error",
      message: "Something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV == "production ") {
    if (err.name === "CastError") sendErrorProd(handleCastErrorDB(err), res);

    if (err.name === "ValidationError")
      sendErrorProd(handleValidationErrorDB(err), res);

    sendErrorProd(err, res);
  }
};
