const express = require("express");
const router = express.Router();
const {
  allDonorHandler,
  createDonorHandler,
  singleDonorHandler,
  loginDonorHandler,
} = require("../controllers/donorController");

//router.param("id", checkExistingUser);
router.get("/", allDonorHandler);
router.post("/", createDonorHandler);
router.get("/:id", singleDonorHandler);
router.post("/login", loginDonorHandler);

module.exports = router;
