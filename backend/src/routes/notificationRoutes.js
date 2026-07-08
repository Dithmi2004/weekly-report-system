const express = require("express");

const {
  getMyNotifications,
  markMyNotificationsRead,
} = require("../controllers/notificationController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateUser, getMyNotifications);
router.patch("/read", authenticateUser, markMyNotificationsRead);

module.exports = router;
