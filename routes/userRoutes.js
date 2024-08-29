const express = require("express");
const router = express.Router();
const {
  allUsersHandler,
  singleUserHandler,
  deleteUserHandler,
  updatePasswordHandler,
  updateUserInfoHandler,
} = require("../controllers/userController");
const {
  protectRoutes,
  permissionRestricted,
} = require("../middleware/authMiddleware");

const {
  createReviewHandler,
  getAllReviewsHandler,
} = require("../controllers/reviewController");

router
  .route("/:id")
  .get(protectRoutes, singleUserHandler)
  .delete(protectRoutes, permissionRestricted);

router.get("/", protectRoutes, allUsersHandler);
router.patch("/update-password", protectRoutes, updatePasswordHandler);
router.patch("/update-userinfo", protectRoutes, updateUserInfoHandler);

router
  .route("/:userId/reviews")
  .post(protectRoutes, createReviewHandler)
  .get(protectRoutes, getAllReviewsHandler);

module.exports = router;
