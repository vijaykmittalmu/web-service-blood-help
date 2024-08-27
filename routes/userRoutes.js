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
  updatePasswordHandler,
  updateUserInfoHandler,
} = require("../controllers/userController");

//router.param("id", checkExistingUser);
router.get("/", protectRoutes, allUsersHandler);
router.get("/:id", protectRoutes, singleUserHandler);
router.delete("/:id", protectRoutes, permissionRestricted, deleteUserHandler);
router.patch("/update-password", protectRoutes, updatePasswordHandler);
router.patch("/update-userinfo", protectRoutes, updateUserInfoHandler);

module.exports = router;
