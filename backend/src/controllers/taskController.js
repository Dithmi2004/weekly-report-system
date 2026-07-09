const taskService = require("../services/taskService");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.body, req.user.id);
  return successResponse(res, "Task created successfully", task, 201);
});

const getTasks = asyncHandler(async (req, res) => {
  const hasQuery = Object.keys(req.query).length > 0;
  const tasks = hasQuery
    ? await taskService.getTasksPaginated(req.query)
    : await taskService.getTasks(req.query);

  return successResponse(res, "Tasks fetched successfully", tasks);
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskByIdForUser(req.params.id, req.user);
  return successResponse(res, "Task fetched successfully", task);
});

const getMyTasks = asyncHandler(async (req, res) => {
  const hasQuery = Object.keys(req.query).length > 0;
  const tasks = hasQuery
    ? await taskService.getMyTasksPaginated(req.user.id, req.query)
    : await taskService.getMyTasks(req.user.id);

  return successResponse(res, "My tasks fetched successfully", tasks);
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body);
  return successResponse(res, "Task updated successfully", task);
});

const updateMyTaskStatus = asyncHandler(async (req, res) => {
  const task = await taskService.updateMyTaskStatus(
    req.params.id,
    req.user.id,
    req.body.status,
  );

  return successResponse(res, "Task status updated successfully", task);
});

const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id);
  return successResponse(res, "Task deleted successfully");
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  getMyTasks,
  updateTask,
  updateMyTaskStatus,
  deleteTask,
};
