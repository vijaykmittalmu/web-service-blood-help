const express = require("express");
const {
  createUserHandler,
  loginUserHandler,
} = require("../controllers/authController");

const router = express.Router();

router.post("/create-donor", createUserHandler);
router.post("/login", loginUserHandler);

module.exports = router;
