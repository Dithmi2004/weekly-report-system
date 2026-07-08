const express = require("express");

const {
  createWeeklyReport,
  getMyWeeklyReports,
  getMyWeeklyReportById,
  updateWeeklyReport,
  submitWeeklyReport,
  getAllReportsForManager,
  getManagerWeeklyReportById,
  resolveReportBlocker,
} = require("../controllers/weeklyReportController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const {
  weeklyReportValidator,
} = require("../validators/weeklyReportValidator");

const router = express.Router();

router.get(
  "/manager/all",
  authenticateUser,
  authorizeRoles("MANAGER"),
  getAllReportsForManager,
);

router.get(
  "/manager/:id",
  authenticateUser,
  authorizeRoles("MANAGER"),
  getManagerWeeklyReportById,
);

router.patch(
  "/manager/:id/blocker/resolve",
  authenticateUser,
  authorizeRoles("MANAGER"),
  resolveReportBlocker,
);

router.post(
  "/",
  authenticateUser,
  authorizeRoles("TEAM_MEMBER"),
  weeklyReportValidator,
  createWeeklyReport,
);

router.get("/my", authenticateUser, getMyWeeklyReports);

router.get("/my/:id", authenticateUser, getMyWeeklyReportById);

router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("TEAM_MEMBER"),
  weeklyReportValidator,
  updateWeeklyReport,
);

router.post(
  "/:id/submit",
  authenticateUser,
  authorizeRoles("TEAM_MEMBER"),
  submitWeeklyReport,
);

module.exports = router;
