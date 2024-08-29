const express = require("express");
const {
  createUserHandler,
  loginUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
} = require("../controllers/authController");

const router = express.Router();

router.post("/create-user", createUserHandler);
router.post("/login", loginUserHandler);
router.post("/forgot-password", forgotPasswordHandler);
router.patch("/reset-password/:token", resetPasswordHandler);

module.exports = router;
