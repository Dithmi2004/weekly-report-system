import apiClient from "./apiClient";

export const sendAssistantMessage = async (message) => {
  const response = await apiClient.post("/assistant/chat", { message });
  return response.data.data;
};
