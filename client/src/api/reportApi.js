import apiClient from "./apiClient";

export const getMyReports = async () => {
  const response = await apiClient.get("/reports/my");
  return response.data.data;
};

export const submitReport = async (reportId) => {
  const response = await apiClient.post(`/reports/${reportId}/submit`);
  return response.data.data;
};
