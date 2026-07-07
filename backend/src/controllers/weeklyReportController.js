const weeklyReportService = require("../services/weeklyReportService");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const createWeeklyReport = asyncHandler(async (req, res) => {
  const report = await weeklyReportService.createWeeklyReport(
    req.user.id,
    req.body
  );

  return successResponse(res, "Weekly report created successfully", report, 201);
});

const getMyWeeklyReports = asyncHandler(async (req, res) => {
  const reports = await weeklyReportService.getMyWeeklyReports(req.user.id);

  return successResponse(res, "Weekly reports fetched successfully", reports);
});

const getMyWeeklyReportById = asyncHandler(async (req, res) => {
  const report = await weeklyReportService.getWeeklyReportById(
    req.params.id,
    req.user.id
  );

  return successResponse(res, "Weekly report fetched successfully", report);
});

const updateWeeklyReport = asyncHandler(async (req, res) => {
  const report = await weeklyReportService.updateWeeklyReport(
    req.params.id,
    req.user.id,
    req.body
  );

  return successResponse(res, "Weekly report updated successfully", report);
});

const submitWeeklyReport = asyncHandler(async (req, res) => {
  const report = await weeklyReportService.submitWeeklyReport(
    req.params.id,
    req.user.id
  );

  return successResponse(res, "Weekly report submitted successfully", report);
});

const getAllReportsForManager = asyncHandler(async (req, res) => {
  const reports = await weeklyReportService.getAllReportsForManager(req.query);

  return successResponse(res, "Team reports fetched successfully", reports);
});

module.exports = {
  createWeeklyReport,
  getMyWeeklyReports,
  getMyWeeklyReportById,
  updateWeeklyReport,
  submitWeeklyReport,
  getAllReportsForManager,
};