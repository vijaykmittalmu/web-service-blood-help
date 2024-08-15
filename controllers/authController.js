const Donor = require("../models/donorModel");
const { sendResponse } = require("../utils/helper");

exports.createDonorHandler = async (req, res) => {
  try {
    const donor = await Donor.findOne({
      mobile_number: req.body.mobile_number,
    });
    if (donor) {
      return sendResponse(res, 404, "Donor already exist.");
    }

    const newDonor = new Donor(req.body);
    await newDonor.save();
    sendResponse(res, 200, "New donor successfully registered.", newDonor);
  } catch (err) {
    console.error(err);
    if (err.name === "Error") {
      return sendResponse(res, 400, err.message);
    }
    sendResponse(res, 400, "Invalid request", err);
  }
};

exports.loginDonorHandler = async (req, res) => {
  try {
    const donor = await Donor.findOne({ email: req.body.email });
    if (!donor) {
      return sendResponse(res, 404, "Donor does not exist.");
    }

    let isPasswordMatch = await donor.passwordCompareHandler(
      req.body.password,
      donor.password
    );

    if (!isPasswordMatch) {
      return sendResponse(res, 404, "Username and password are invalid.");
    }
    donor.password = undefined;
    sendResponse(res, 200, "success", donor);
  } catch (err) {
    console.error(err);
    sendResponse(res, 400, "Invalid request", err);
  }
};
