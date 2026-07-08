import apiClient from "./apiClient";

export const getProjects = async (params) => {
  const response = await apiClient.get("/projects", { params });
  return response.data.data;
};

export const createProject = async (projectData) => {
  const response = await apiClient.post("/projects", projectData);
  return response.data.data;
};

export const updateProject = async (projectId, projectData) => {
  const response = await apiClient.put(`/projects/${projectId}`, projectData);
  return response.data.data;
};

export const deleteProject = async (projectId) => {
  const response = await apiClient.delete(`/projects/${projectId}`);
  return response.data;
};

export const assignProjectMember = async (projectId, userId) => {
  const response = await apiClient.post(`/projects/${projectId}/members`, {
    userId,
  });
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
