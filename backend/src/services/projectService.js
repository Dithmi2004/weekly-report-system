const db = require("../config/database");

const getAllProjects = async () => {
  const [projects] = await db.query(
    `SELECT id, name, description, status, created_at, updated_at
     FROM projects
     ORDER BY created_at DESC`
  );

  return projects;
};

const createProject = async ({ name, description }) => {
  const [result] = await db.query(
    `INSERT INTO projects (name, description)
     VALUES (?, ?)`,
    [name, description || null]
  );

  return {
    id: result.insertId,
    name,
    description: description || null,
    status: "ACTIVE",
  };
};

const updateProject = async (projectId, { name, description, status }) => {
  const [existing] = await db.query("SELECT id FROM projects WHERE id = ?", [
    projectId,
  ]);

  if (existing.length === 0) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  await db.query(
    `UPDATE projects
     SET name = ?, description = ?, status = ?
     WHERE id = ?`,
    [name, description || null, status || "ACTIVE", projectId]
  );

  return {
    id: Number(projectId),
    name,
    description: description || null,
    status: status || "ACTIVE",
  };
};

const deleteProject = async (projectId) => {
  const [existing] = await db.query("SELECT id FROM projects WHERE id = ?", [
    projectId,
  ]);

  if (existing.length === 0) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  await db.query("DELETE FROM projects WHERE id = ?", [projectId]);

  return true;
};

const assignUserToProject = async (projectId, userId) => {
  const [project] = await db.query("SELECT id FROM projects WHERE id = ?", [
    projectId,
  ]);

  if (project.length === 0) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  const [user] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);

  if (user.length === 0) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  await db.query(
    `INSERT IGNORE INTO project_members (user_id, project_id)
     VALUES (?, ?)`,
    [userId, projectId]
  );

  return {
    userId,
    projectId,
  };
};

const getProjectMembers = async (projectId) => {
  const [members] = await db.query(
    `SELECT 
        u.id,
        u.first_name AS firstName,
        u.last_name AS lastName,
        u.email,
        u.role
     FROM project_members up
     INNER JOIN users u ON up.user_id = u.id
     WHERE up.project_id = ?`,
    [projectId]
  );

  return members;
};

const getMyProjects = async (userId) => {
  const [projects] = await db.query(
    `SELECT 
        p.id,
        p.name,
        p.description,
        p.status
     FROM project_members up
     INNER JOIN projects p ON up.project_id = p.id
     WHERE up.user_id = ?`,
    [userId]
  );

  return projects;
};

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  assignUserToProject,
  getProjectMembers,
  getMyProjects,
};