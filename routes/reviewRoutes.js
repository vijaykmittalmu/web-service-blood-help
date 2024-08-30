const express = require("express");
const { permissionRestricted } = require("../middleware/authMiddleware");
const {
  getAllReviewsHandler,
  createReviewHandler,
  deleteReviewHandler,
} = require("../controllers/reviewController");

const router = express.Router({ mergeParams: true });

router.route("/:id").delete(permissionRestricted, deleteReviewHandler);
router.route("/").post(createReviewHandler).get(getAllReviewsHandler);

module.exports = router;
