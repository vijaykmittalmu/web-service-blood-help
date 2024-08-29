const express = require("express");
const { protectRoutes } = require("../middleware/authMiddleware");
const {
  getAllReviewsHandler,
  createReviewHandler,
} = require("../controllers/reviewController");
const router = express.Router();

// review routes
router.get("/", protectRoutes, getAllReviewsHandler);
router.post("/add-review", protectRoutes, createReviewHandler);

module.exports = router;
