const db = require("../config/database");
const notificationService = require("./notificationService");

const getAllProjects = async () => {
  const [projects] = await db.query(
    `SELECT 
        p.id,
        p.name,
        p.description,
        p.status,
        p.created_at AS createdAt,
        p.updated_at AS updatedAt,
        COUNT(DISTINCT pm.user_id) AS memberCount,
        COUNT(DISTINCT t.id) AS totalTasks,
        SUM(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completedTasks
     FROM projects p
     LEFT JOIN project_members pm ON p.id = pm.project_id
     LEFT JOIN tasks t ON p.id = t.project_id
     GROUP BY p.id
     ORDER BY p.created_at DESC`
  );

  return projects.map((project) => ({
    ...project,
    completedTasks: Number(project.completedTasks) || 0,
    progress:
      Number(project.totalTasks) === 0
        ? 0
        : Math.round((Number(project.completedTasks || 0) / Number(project.totalTasks)) * 100),
  }));
};

const getProjectsPaginated = async (filters = {}) => {
  const page = Math.max(Number(filters.page) || 1, 1);
  const limit = Math.min(Math.max(Number(filters.limit) || 6, 1), 50);
  const offset = (page - 1) * limit;

  let whereClause = "WHERE 1=1";
  const params = [];

  if (filters.status && filters.status !== "ALL") {
    whereClause += " AND p.status = ?";
    params.push(filters.status);
  }

  if (filters.search) {
    whereClause += " AND (p.name LIKE ? OR p.description LIKE ?)";
    const search = `%${filters.search}%`;
    params.push(search, search);
  }

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM projects p ${whereClause}`,
    params
  );

  const [projects] = await db.query(
    `SELECT 
        p.id,
        p.name,
        p.description,
        p.status,
        p.created_at AS createdAt,
        p.updated_at AS updatedAt,
        COUNT(DISTINCT pm.user_id) AS memberCount,
        COUNT(DISTINCT t.id) AS totalTasks,
        SUM(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completedTasks
     FROM projects p
     LEFT JOIN project_members pm ON p.id = pm.project_id
     LEFT JOIN tasks t ON p.id = t.project_id
     ${whereClause}
     GROUP BY p.id
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const total = countRows[0].total;

  return {
    items: projects.map((project) => ({
      ...project,
      completedTasks: Number(project.completedTasks) || 0,
      progress:
        Number(project.totalTasks) === 0
          ? 0
          : Math.round((Number(project.completedTasks || 0) / Number(project.totalTasks)) * 100),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  };
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
  const [project] = await db.query("SELECT id, name FROM projects WHERE id = ?", [
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

  const [assignment] = await db.query(
    `INSERT IGNORE INTO project_members (user_id, project_id)
     VALUES (?, ?)`,
    [userId, projectId]
  );

  if (assignment.affectedRows > 0) {
    await notificationService.createNotification({
      userId,
      title: "Project assigned",
      message: `You were assigned to ${project[0].name}.`,
      type: "PROJECT_ASSIGNED",
      link: "/member/projects",
    });
  }

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
     FROM projects p
     WHERE EXISTS (
       SELECT 1
       FROM project_members pm
       WHERE pm.project_id = p.id
         AND pm.user_id = ?
     )
     OR EXISTS (
       SELECT 1
       FROM tasks t
       WHERE t.project_id = p.id
         AND t.assigned_to = ?
     )
     ORDER BY p.created_at DESC`,
    [userId, userId]
  );

  return projects;
};

module.exports = {
  getAllProjects,
  getProjectsPaginated,
  createProject,
  updateProject,
  deleteProject,
  assignUserToProject,
  getProjectMembers,
  getMyProjects,
};
