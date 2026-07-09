const projectService = require("../services/projectService");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");

const getProjects = asyncHandler(async (req, res) => {
  const hasQuery = Object.keys(req.query).length > 0;
  const projects = hasQuery
    ? await projectService.getProjectsPaginated(req.query)
    : await projectService.getAllProjects();

  return successResponse(res, "Projects fetched successfully", projects);
});

const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.body);
  return successResponse(res, "Project created successfully", project, 201);
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(req.params.id, req.body);
  return successResponse(res, "Project updated successfully", project);
});

const deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(req.params.id);
  return successResponse(res, "Project deleted successfully");
});

const assignMember = asyncHandler(async (req, res) => {
  const result = await projectService.assignUserToProject(
    req.params.id,
    req.body.userId,
  );

  return successResponse(res, "User assigned to project successfully", result);
});

const getMembers = asyncHandler(async (req, res) => {
  const members = await projectService.getProjectMembers(req.params.id);
  return successResponse(res, "Project members fetched successfully", members);
});

const getMyProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getMyProjects(req.user.id);
  return successResponse(res, "Assigned projects fetched successfully", projects);
});

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  assignMember,
  getMembers,
  getMyProjects,
};
