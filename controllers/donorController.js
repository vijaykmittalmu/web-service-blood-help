const Donor = require("./../models/donorModel");
const { sendResponse } = require("../utils/helper");

exports.allDonorHandler = async (req, res) => {
  try {
    const donors = await Donor.find().select("-password");
    sendResponse(res, 200, "success", donors);
  } catch (err) {
    console.error(err);
    sendResponse(res, 400, "Invalid request", err);
  }
};

exports.singleDonorHandler = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id).select("-password");
    if (!donor) {
      return sendResponse(res, 404, "Donor does not exist.");
    }
    sendResponse(res, 200, "success", donor);
  } catch (err) {
    console.error(err);
    sendResponse(res, 400, "Invalid request", err);
  }
};
