import apiClient from "./apiClient";

export const getNotifications = async () => {
  const response = await apiClient.get("/notifications");
  return response.data.data;
};

export const markNotificationsRead = async () => {
  const response = await apiClient.patch("/notifications/read");
  return response.data.data;
};
