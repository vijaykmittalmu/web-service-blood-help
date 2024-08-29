const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");

// get all reviews for selected users
exports.getAllReviewsHandler = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.params.userId });
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
