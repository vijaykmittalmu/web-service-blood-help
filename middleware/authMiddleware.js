const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const catchAsync = require("../utils/catchAsync");

exports.protectRoutes = catchAsync(async (req, res, next) => {
  let token;
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: 401,
      message: "unauthorized access",
    });
  }

  token = req.headers.authorization.split(" ")[1];
  if (!token)
    res.status(401).json({
      status: 401,
      message: "token is not available",
    });

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const userInfo = await User.findById(decoded.id);
  if (!userInfo) {
    return res.status(401).json({
      status: 401,
      message: "User information does not exist.",
    });
  }
  req.user = userInfo;
  next();
});

exports.permissionRestricted = (req, res, next) => {
  console.log(req.user.role);
  if (req.user.role === "user") {
    return next(
      res.status(403).json({
        status: 403,
        message: "You don't have permission to perform this action.",
      })
    );
  }
  next();
};
