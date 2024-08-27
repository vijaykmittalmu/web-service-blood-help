const crypto = require("crypto");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// New user registration handler
exports.createUserHandler = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    $or: [{ mobile_number: req.body.mobile_number }, { email: req.body.email }],
  });

  if (user) {
    return next(
      new AppError(
        "User already exist. please use different email and mobile number",
        400
      )
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
});

// login user handler
exports.loginUserHandler = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("User does not exist.", 400));
  }

  let isPasswordMatch = await user.passwordCompareHandler(
    req.body.password,
    user.password
  );

  if (!isPasswordMatch) {
    return next(new AppError("Username and password are invalid.", 400));
  }
  user.password = undefined;
  const token = await user.generateJwtToen(user._id);

  res.status(200).json({
    status: 200,
    message: "success",
    token,
  });
});

// forgot password
exports.forgotPasswordHandler = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return next(new AppError("Please enter email address", 400));
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("User does not exist", 400));
  }

  try {
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
    return next(new AppError(400, err));
  }
});

// reset password
exports.resetPasswordHandler = catchAsync(async (req, res, next) => {
  const hashedToken = await crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or expired", 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  const token = await user.generateJwtToen(user._id);
  await user.save();
  res.status(200).json({
    message: "Password reset successfully.",
    token,
  });
});
