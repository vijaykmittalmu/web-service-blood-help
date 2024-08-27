const express = require("express");
const router = express.Router();
const {
  allUsersHandler,
  singleUserHandler,
  deleteUserHandler,
  updatePasswordHandler,
  updateUserInfoHandler,
} = require("../controllers/userController");
const {
  protectRoutes,
  permissionRestricted,
} = require("../middleware/authMiddleware");

//router.param("id", checkExistingUser);
router.get("/", protectRoutes, allUsersHandler);
router.get("/:id", protectRoutes, singleUserHandler);
router.delete("/:id", protectRoutes, permissionRestricted, deleteUserHandler);
router.patch("/update-password", protectRoutes, updatePasswordHandler);
router.patch("/update-userinfo", protectRoutes, updateUserInfoHandler);

module.exports = router;
