const express = require("express");
const {
  createDonorHandler,
  loginDonorHandler,
} = require("../controllers/authController");

const router = express.Router();

router.post("/create-donor", createDonorHandler);
router.post("/login", loginDonorHandler);

module.exports = router;
