const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { sendResponse, filterObject } = require("../utils/helper");

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("Document is not available", 400));
    }
    sendResponse(res, 200, "Document has been removed successfully.");
    next();
  });
};

exports.updateOne = (Model, allowedFilter) => {
  return catchAsync(async (req, res) => {
    const updatedFilterData = filterObject(req.body, allowedFilter);
    const docInfo = await Model.findByIdAndUpdate(
      req.user.id,
      updatedFilterData,
      {
        new: true,
        runValidators: true,
      }
    );

    sendResponse(res, 200, "Information update successfully.", docInfo);
  });
};
