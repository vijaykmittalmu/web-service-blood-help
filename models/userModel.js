const crypto = require("crypto");
const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const { emailRegex, mobileNumberRegex, passwordRegex } = require("../config");

// const locationSchema = new Schema({
//   type: {
//     type: String,
//     default: "Point",
//     enum: ["Point"],
//   },
//   coordintes: [Number],
//   address: String,
// });

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "The name field is required."],
      trim: true,
      lowercase: true,
    },
    blood_group: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: [true, "The blood group field is required."],
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Please enter valid email address."],
      required: [true, "The email field is required."],
      trim: true,
      lowercase: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      validate: {
        validator: function (v) {
          return passwordRegex.test(v);
        },
        message: `Password must be at least 8 and at most 16 characters long, and must contain at least one uppercase letter, one lowercase letter, one number, and one special character`,
      },
      required: [false, "The password field is required."],
      trim: true,
    },
    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
    },
    mobile_number: {
      type: Number,
      validate: {
        validator: function (v) {
          return mobileNumberRegex.test(v);
        },
        message: (props) => `${props.value} is not a valid mobile number.`,
      },
      required: [true, "The mobile field is required."],
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Gender field is required."],
    },
    profile_image: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "The description field is required."],
      trim: true,
    },
    passwordResetToken: String,
    passwordTokenExpires: Date,
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "user",
  localField: "_id",
});

// pre middleware function
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(this.password, salt);
  this.password = hashPassword;
  next();
});

// hash password generate handler
userSchema.methods.passwordCompareHandler = async function (
  password,
  hashPassword
) {
  console.log("------------");
  console.log(password);
  console.log(hashPassword);
  return await bcrypt.compare(password, hashPassword);
};

// jwt token generate handler
userSchema.methods.generateJwtToen = async function (userId) {
  return await jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// random token generate for forgot password
userSchema.methods.randomTokenGenerate = async function () {
  const randomToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(randomToken)
    .digest("hex");
  this.passwordTokenExpires = Date.now() + 10 * 60 * 1000;

  return randomToken;
};

const User = model("User", userSchema);
module.exports = User;
