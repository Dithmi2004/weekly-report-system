import apiClient from "./apiClient";

export const getProjects = async () => {
  const response = await apiClient.get("/projects");
  return response.data.data;
};

export const getMyProjects = async () => {
  const response = await apiClient.get("/projects/my-projects");
  return response.data.data;
};

export const getProjectMembers = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/members`);
  return response.data.data;
};
