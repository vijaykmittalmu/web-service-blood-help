const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { sendResponse, filterObject } = require("../utils/helper");
const { validBloodGroups } = require("../utils/constant");

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

exports.updatePasswordHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatch = await user.passwordCompareHandler(
      req.body.currentPassword,
      user.password
    );

    if (!isPasswordMatch) {
      return sendResponse(res, 404, "Current password did not match.");
    }

    user.password = req.body.newPassword;
    await user.save();

    const token = await user.generateJwtToen(user._id);
    res.status(200).json({
      status: 200,
      message: "Password update successfully.",
      token,
    });
  } catch (err) {
    console.log(err);
    sendResponse(res, 400, "Invalid request", err);
  }
};

exports.updateUserInfoHandler = async (req, res) => {
  try {
    const updatedFilterData = filterObject(
      req.body,
      "name",
      "blood_group",
      "email",
      "mobile_number",
      "gender",
      "profile_image",
      "description"
    );

    const userInfo = await User.findByIdAndUpdate(
      req.user.id,
      updatedFilterData,
      {
        new: true,
        runValidators: true,
      }
    );

    sendResponse(res, 200, "User information update successfully.", userInfo);
  } catch (err) {
    console.log(err);
    sendResponse(res, 400, "Invalid request", err);
  }
};
