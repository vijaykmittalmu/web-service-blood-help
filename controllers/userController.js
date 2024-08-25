const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/userModel");
const { sendResponse } = require("../utils/helper");
const { validBloodGroups } = require("../utils/constant");
const sendEmail = require("../utils/email");

// middlewares
exports.protectRoutes = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(
      res.status(401).json({
        status: 401,
        errors: err,
      })
    );
  }
};

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

// get all user
exports.allUsersHandler = async (req, res) => {
  try {
    const { blood_group, city, state } = req.query;
    const query = {};
    const sortBy = req.query.sort || "name";

    if (blood_group) {
      if (validBloodGroups.includes(blood_group)) {
        query["blood_group"] = blood_group;
      } else {
        return sendResponse(res, 400, "Invalid request", {
          error: "blood group is not valid",
        });
      }
    }
    if (city) query["location.city"] = city;
    if (state) query["location.state"] = state;

    const users = await User.find(query)
      .select("-password")
      .sort({ [sortBy]: 1 });

    sendResponse(res, 200, "success", { length: users.length, users });
  } catch (err) {
    console.error(err);
    sendResponse(res, 400, "Invalid request", err);
  }
};

// get single user
exports.singleUserHandler = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return sendResponse(res, 404, "User does not exist.");
    }
    sendResponse(res, 200, "success", user);
  } catch (err) {
    sendResponse(res, 400, "Invalid request", err);
  }
};

// delete user
exports.deleteUserHandler = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return sendResponse(res, 404, "User does not exist.");
    }
    sendResponse(res, 200, "User has been removed successfully.");
  } catch (err) {
    sendResponse(res, 400, "Invalid request", err);
  }
};

// forgot password
exports.forgotPasswordHandler = async (req, res) => {
  try {
    if (!req.body.email) {
      return sendResponse(res, 400, "Please enter email address");
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return sendResponse(res, 404, "User does not exist.");
    }

    const resetToken = await user.randomTokenGenerate();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `<a href="${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/reset-password/${resetToken}">${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/reset-password/${resetToken}</a>`;

    const message = `
      <h4>Forgot your password? Submit a patch request with your new password and passwordConfirm to: ${resetUrl}.<br/><br/>If you didn't forgot your password, please ignore this email.
    </h4>`;

    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      message: "reset password token has been successfully sent.",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    sendResponse(res, 400, "Invalid request", err);
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = await crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return sendResponse(res, 400, "Token is invalid or expired");
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;

    await user.save();
    res.status(200).json({
      message: "Password reset successfully.",
    });
  } catch (err) {
    sendResponse(res, 400, "Invalid request", err);
  }
};
