const User = require("../models/userModel");
const { sendResponse, filterObject } = require("../utils/helper");
const { validBloodGroups } = require("../utils/constant");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const factory = require("./factoryHandler");

// get all user
exports.allUsersHandler = catchAsync(async (req, res, next) => {
  const { blood_group, city, state } = req.query;
  const query = {};
  const sortBy = req.query.sort || "name";

  if (blood_group) {
    if (validBloodGroups.includes(blood_group)) {
      query["blood_group"] = blood_group;
    } else {
      return next(new AppError("blood group is not valid", 400));
    }
  }
  if (city) query["location.city"] = city;
  if (state) query["location.state"] = state;

  const users = await User.find(query)
    .select("-password")
    .sort({ [sortBy]: 1 });

  sendResponse(res, 200, "success", { length: users.length, users });
});

// get single user
exports.singleUserHandler = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("reviews");
  if (!user) {
    return next(new AppError("User does not exist", 400));
  }
  console.log(user);
  sendResponse(res, 200, "success", user);
  next();
});

exports.updatePasswordHandler = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatch = await user.passwordCompareHandler(
    req.body.currentPassword,
    user.password
  );

  if (!isPasswordMatch) {
    return next(new AppError("Current password did not match", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  const token = await user.generateJwtToen(user._id);
  res.status(200).json({
    status: 200,
    message: "Password update successfully.",
    token,
  });
});

// delete user
exports.deleteUserHandler = factory.deleteOne(User);

// update login user information
exports.updateUserInfoHandler = factory.updateOne(
  User,
  "name",
  "blood_group",
  "email",
  "mobile_number",
  "gender",
  "profile_image",
  "description"
);
