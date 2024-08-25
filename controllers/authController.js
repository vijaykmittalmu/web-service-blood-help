const User = require("../models/userModel");
const { sendResponse } = require("../utils/helper");

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
