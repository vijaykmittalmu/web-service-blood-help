const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const { emailRegex, mobileNumberRegex, passwordRegex } = require("../config");

const donorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "The name field is required."],
    },
    blood_group: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: [true, "The blood group field is required."],
    },
    email: {
      type: String,
      validate: {
        validator: function (v) {
          return emailRegex.test(v);
        },
        message: (props) => `${props.value} is not a valid email address.`,
      },
      required: [true, "The email field is required."],
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
    },
  },
  { versionKey: false }
);

// pre middleware function
donorSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(this.password, salt);
  this.password = hashPassword;
  console.log(hashPassword);
  next();
});

donorSchema.methods.passwordCompareHandler = async function (
  password,
  hashPassword
) {
  return await bcrypt.compare(password, hashPassword);
};

const Donor = model("Donor", donorSchema);
module.exports = Donor;
