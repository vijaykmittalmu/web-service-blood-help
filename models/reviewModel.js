const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, "Review field is required"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Rating fiels is required"],
    },
    user: {
      type: Schema.ObjectId,
      ref: "User",
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false }
);

// reviewSchema.pre(/^find/, async function (next) {
//   this.populate({
//     path: "user",
//     select: "name",
//   });
// });

const Review = model("Review", reviewSchema);
module.exports = Review;
