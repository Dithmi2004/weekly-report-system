import apiClient from "./apiClient";

export const getMyTasks = async () => {
  const response = await apiClient.get("/tasks/my-tasks");
  return response.data.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await apiClient.patch(`/tasks/${taskId}/status`, { status });
  return response.data.data;
};
