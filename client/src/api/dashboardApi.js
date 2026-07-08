import apiClient from "./apiClient";

const getDashboardData = async (path) => {
  const response = await apiClient.get(path);
  return response.data.data;
};

export const getDashboardSummary = () => getDashboardData("/dashboard/summary");

export const getSubmissionStatus = () =>
  getDashboardData("/dashboard/submission-status");

export const getProjectDistribution = () =>
  getDashboardData("/dashboard/project-distribution");

export const getTasksTrend = () => getDashboardData("/dashboard/tasks-trend");

export const getRecentActivity = () =>
  getDashboardData("/dashboard/recent-activity");
