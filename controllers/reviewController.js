const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./factoryHandler");

// get all reviews for selected users
exports.getAllReviewsHandler = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.userId) filter = { user: req.params.userId };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 200,
    message: "success",
    length: reviews.length,
    reviews,
  });
});

// new review added for the user
exports.createReviewHandler = catchAsync(async (req, res) => {
  if (req.params.userId) req.body.user = req.params.userId;
  console.log(req.body);
  const review = new Review(req.body);
  await review.save();
  res.status(200).json({
    status: 200,
    message: "review successfully posted.",
    review,
  });
});

// delete user
exports.deleteReviewHandler = factory.deleteOne(Review);
