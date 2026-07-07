const express = require("express");

const {
  getSummary,
  getSubmissionStatus,
  getProjectDistribution,
  getTasksTrend,
  getRecentActivity,
} = require("../controllers/dashboardController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateUser);
router.use(authorizeRoles("MANAGER"));

router.get("/summary", getSummary);
router.get("/submission-status", getSubmissionStatus);
router.get("/project-distribution", getProjectDistribution);
router.get("/tasks-trend", getTasksTrend);
router.get("/recent-activity", getRecentActivity);

module.exports = router;