import apiClient from "./apiClient";

export const getUsers = async () => {
  const response = await apiClient.get("/users");
  return response.data.data;
};

export const createUser = async (userData) => {
  const response = await apiClient.post("/users", userData);
  return response.data.data;
};

export const getTeamMembers = async () => {
  const response = await apiClient.get("/users/team-members");
  return response.data.data;
};

export const changePassword = async (passwordData) => {
  const response = await apiClient.patch("/users/password", passwordData);
  return response.data;
};
