import apiClient from "./apiClient";

export const getTasks = async (params) => {
  const response = await apiClient.get("/tasks", { params });
  return response.data.data;
};

export const getMyTasks = async (params) => {
  const response = await apiClient.get("/tasks/my-tasks", { params });
  return response.data.data;
};

export const createTask = async (taskData) => {
  const response = await apiClient.post("/tasks", taskData);
  return response.data.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await apiClient.put(`/tasks/${taskId}`, taskData);
  return response.data.data;
};

export const deleteTask = async (taskId) => {
  const response = await apiClient.delete(`/tasks/${taskId}`);
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await apiClient.patch(`/tasks/${taskId}/status`, { status });
  return response.data.data;
};
