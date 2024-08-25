const express = require("express");
const router = express.Router();
const {
  allUsersHandler,
  singleUserHandler,
  protectRoutes,
  permissionRestricted,
  deleteUserHandler,
  forgotPasswordHandler,
  resetPassword,
} = require("../controllers/userController");

//router.param("id", checkExistingUser);
router.get("/", protectRoutes, allUsersHandler);
router.get("/:id", protectRoutes, singleUserHandler);
router.delete("/:id", protectRoutes, permissionRestricted, deleteUserHandler);
router.post("/forgot-password", forgotPasswordHandler);
router.patch("/reset-password/:token", resetPassword);

module.exports = router;
