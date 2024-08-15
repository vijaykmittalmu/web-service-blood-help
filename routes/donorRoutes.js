const express = require("express");
const router = express.Router();
const {
  allDonorHandler,
  singleDonorHandler,
} = require("../controllers/donorController");

//router.param("id", checkExistingUser);
router.get("/", allDonorHandler);
router.get("/:id", singleDonorHandler);

module.exports = router;
