const express = require("express");
const router = express.Router();
const {
  allUsersHandler,
  singleUserHandler,
  deleteUserHandler,
  updatePasswordHandler,
  updateUserInfoHandler,
} = require("../controllers/userController");
const { permissionRestricted } = require("../middleware/authMiddleware");

const {
  createReviewHandler,
  getAllReviewsHandler,
} = require("../controllers/reviewController");

router
  .route("/:id")
  .get(singleUserHandler)
  .delete(permissionRestricted, deleteUserHandler);

router.get("/", allUsersHandler);
router.patch("/update-password", updatePasswordHandler);
router.patch("/update-userinfo", updateUserInfoHandler);

router
  .route("/:userId/reviews")
  .post(createReviewHandler)
  .get(getAllReviewsHandler);

module.exports = router;
