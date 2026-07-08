import apiClient from "./apiClient";

const getDashboardData = async (path, params) => {
  const response = await apiClient.get(path, { params });
  return response.data.data;
};

export const getDashboardSummary = (params) =>
  getDashboardData("/dashboard/summary", params);

export const getSubmissionStatus = (params) =>
  getDashboardData("/dashboard/submission-status", params);

export const getProjectDistribution = () =>
  getDashboardData("/dashboard/project-distribution");

export const getTasksTrend = () => getDashboardData("/dashboard/tasks-trend");

export const getRecentActivity = () =>
  getDashboardData("/dashboard/recent-activity");
