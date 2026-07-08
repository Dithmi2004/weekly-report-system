import apiClient from "./apiClient";

export const getTeamMembers = async () => {
  const response = await apiClient.get("/users/team-members");
  return response.data.data;
};
