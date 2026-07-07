const projectService = require("../services/projectService");

const getProjects = async (req, res) => {
  try {
    const projects = await projectService.getAllProjects();

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching projects",
    });
  }
};

const createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(req.body);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error while creating project",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error while updating project",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    await projectService.deleteProject(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error while deleting project",
    });
  }
};

const assignMember = async (req, res) => {
  try {
    const result = await projectService.assignUserToProject(
      req.params.id,
      req.body.userId
    );

    res.status(200).json({
      success: true,
      message: "User assigned to project successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error while assigning user",
    });
  }
};

const getMembers = async (req, res) => {
  try {
    const members = await projectService.getProjectMembers(req.params.id);

    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching project members",
    });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const projects = await projectService.getMyProjects(req.user.id);

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching assigned projects",
    });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  assignMember,
  getMembers,
  getMyProjects,
};