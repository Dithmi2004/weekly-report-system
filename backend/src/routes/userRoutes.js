const express = require("express");
const {
  getProfile,
  getManagerDashboardAccess,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authenticateUser, getProfile);

router.get(
  "/manager-dashboard",
  authenticateUser,
  authorizeRoles("MANAGER"),
  getManagerDashboardAccess
);

module.exports = router;