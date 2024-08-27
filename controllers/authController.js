const crypto = require("crypto");
const User = require("../models/userModel");
const { sendResponse } = require("../utils/helper");
const sendEmail = require("../utils/email");

// New user registration handler
exports.createUserHandler = async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [
        { mobile_number: req.body.mobile_number },
        { email: req.body.email },
      ],
    });

    if (user) {
      return sendResponse(
        res,
        404,
        "User already exist. please use different email and mobile number"
      );
    }

    const newUser = new User(req.body);
    const token = await newUser.generateJwtToen(newUser._id);
    await newUser.save();

    res.status(200).json({
      status: 200,
      message: "New user successfully registered.",
      token,
      response: newUser,
    });
  } catch (err) {
    if (err.name === "Error") {
      return sendResponse(res, 400, err.message);
    }
    sendResponse(res, 400, "Invalid request", err);
  }
};

// login user handler
exports.loginUserHandler = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return sendResponse(res, 404, "User does not exist.");
    }

    let isPasswordMatch = await user.passwordCompareHandler(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      return sendResponse(res, 404, "Username and password are invalid.");
    }
    user.password = undefined;
    const token = await user.generateJwtToen(user._id);

    res.status(200).json({
      status: 200,
      message: "success",
      token,
    });
  } catch (err) {
    sendResponse(res, 400, "Invalid request", err);
  }
};

exports.forgotPasswordHandler = (req, res) => {
  console.log("forgot password");
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
exports.resetPasswordHandler = async (req, res) => {
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
    const token = await user.generateJwtToen(user._id);
    await user.save();
    res.status(200).json({
      message: "Password reset successfully.",
      token,
    });
  } catch (err) {
    sendResponse(res, 400, "Invalid request", err);
  }
};
