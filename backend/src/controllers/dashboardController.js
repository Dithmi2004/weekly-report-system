const dashboardService = require("../services/dashboardService");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const getSummary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSummary(req.query);
  return successResponse(res, "Dashboard summary fetched successfully", data);
});

const getSubmissionStatus = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSubmissionStatus(req.query);
  return successResponse(res, "Submission status fetched successfully", data);
});

const getProjectDistribution = asyncHandler(async (req, res) => {
  const data = await dashboardService.getProjectDistribution();
  return successResponse(res, "Project distribution fetched successfully", data);
});

const getTasksTrend = asyncHandler(async (req, res) => {
  const data = await dashboardService.getTasksTrend();
  return successResponse(res, "Tasks trend fetched successfully", data);
});

const getRecentActivity = asyncHandler(async (req, res) => {
  const data = await dashboardService.getRecentActivity();
  return successResponse(res, "Recent activity fetched successfully", data);
});

module.exports = {
  getSummary,
  getSubmissionStatus,
  getProjectDistribution,
  getTasksTrend,
  getRecentActivity,
};
