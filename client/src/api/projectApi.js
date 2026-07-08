import apiClient from "./apiClient";

export const getMyProjects = async () => {
  const response = await apiClient.get("/projects/my-projects");
  return response.data.data;
};
