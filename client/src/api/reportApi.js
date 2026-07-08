import apiClient from "./apiClient";

export const getMyReports = async () => {
  const response = await apiClient.get("/reports/my");
  return response.data.data;
};

export const getMyReportById = async (reportId) => {
  const response = await apiClient.get(`/reports/my/${reportId}`);
  return response.data.data;
};

export const createReport = async (reportData) => {
  const response = await apiClient.post("/reports", reportData);
  return response.data.data;
};

export const updateReport = async (reportId, reportData) => {
  const response = await apiClient.put(`/reports/${reportId}`, reportData);
  return response.data.data;
};

export const submitReport = async (reportId) => {
  const response = await apiClient.post(`/reports/${reportId}/submit`);
  return response.data.data;
};

export const getAllReports = async (params) => {
  const response = await apiClient.get("/reports/manager/all", { params });
  return response.data.data;
};

export const getManagerReportById = async (reportId) => {
  const response = await apiClient.get(`/reports/manager/${reportId}`);
  return response.data.data;
};
