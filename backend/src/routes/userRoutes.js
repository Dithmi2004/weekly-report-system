const express = require("express");
const {
  changeOwnPassword,
  createUserForManager,
  getProfile,
  getUsersForManager,
  getManagerDashboardAccess,
  getTeamMembersForManager,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const {
  changePasswordValidator,
  createUserValidator,
} = require("../validators/userValidator");

const router = express.Router();

router.get("/profile", authenticateUser, getProfile);
router.patch(
  "/password",
  authenticateUser,
  changePasswordValidator,
  changeOwnPassword
);

router.get("/", authenticateUser, authorizeRoles("MANAGER"), getUsersForManager);

router.post(
  "/",
  authenticateUser,
  authorizeRoles("MANAGER"),
  createUserValidator,
  createUserForManager
);

router.get(
  "/manager-dashboard",
  authenticateUser,
  authorizeRoles("MANAGER"),
  getManagerDashboardAccess
);

router.get(
  "/team-members",
  authenticateUser,
  authorizeRoles("MANAGER"),
  getTeamMembersForManager
);

module.exports = router;
