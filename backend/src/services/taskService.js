const db = require("../config/database");
const notificationService = require("./notificationService");
const { backfillAllManualReportTasks } = require("./weeklyReportService");

const getProjectName = async (projectId) => {
  const [projects] = await db.query("SELECT name FROM projects WHERE id = ?", [
    projectId,
  ]);

  return projects[0]?.name || "the project";
};

const createTask = async (data, managerId) => {
  const {
    projectId,
    assignedTo,
    title,
    description,
    priority,
    deadline,
    status,
  } = data;

  const [result] = await db.query(
    `INSERT INTO tasks 
    (project_id, assigned_to, created_by, title, description, priority, deadline, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      projectId,
      assignedTo,
      managerId,
      title,
      description || null,
      priority || "MEDIUM",
      deadline || null,
      status || "TODO",
    ],
  );

  const projectName = await getProjectName(projectId);

  await notificationService.createNotification({
    userId: assignedTo,
    title: "Task assigned",
    message: `You were assigned "${title}" for ${projectName}.`,
    type: "TASK_ASSIGNED",
    link: "/member/tasks",
  });

  return { id: result.insertId };
};

const getTasks = async (filters) => {
  await backfillAllManualReportTasks();

  let query = `
    SELECT 
      t.id,
      t.title,
      t.description,
      t.priority,
      t.deadline,
      t.status,
      t.project_id AS projectId,
      t.created_by AS createdBy,
      p.name AS projectName,
      CONCAT(u.first_name, ' ', u.last_name) AS assignedToName,
      CONCAT(c.first_name, ' ', c.last_name) AS createdByName,
      c.role AS createdByRole
    FROM tasks t
    INNER JOIN projects p ON t.project_id = p.id
    INNER JOIN users u ON t.assigned_to = u.id
    LEFT JOIN users c ON t.created_by = c.id
    WHERE 1=1
  `;

  const params = [];

  if (filters.projectId && filters.projectId !== "ALL") {
    query += " AND t.project_id = ?";
    params.push(filters.projectId);
  }

  if (filters.assignedTo) {
    query += " AND t.assigned_to = ?";
    params.push(filters.assignedTo);
  }

  if (filters.status) {
    query += " AND t.status = ?";
    params.push(filters.status);
  }

  if (filters.priority) {
    query += " AND t.priority = ?";
    params.push(filters.priority);
  }

  query += " ORDER BY t.created_at DESC";

  const [tasks] = await db.query(query, params);
  return tasks;
};

const getTasksPaginated = async (filters = {}) => {
  await backfillAllManualReportTasks();

  const page = Math.max(Number(filters.page) || 1, 1);
  const limit = Math.min(Math.max(Number(filters.limit) || 8, 1), 50);
  const offset = (page - 1) * limit;

  let whereClause = "WHERE 1=1";
  const params = [];

  if (filters.projectId && filters.projectId !== "ALL") {
    whereClause += " AND t.project_id = ?";
    params.push(filters.projectId);
  }

  if (filters.assignedTo) {
    whereClause += " AND t.assigned_to = ?";
    params.push(filters.assignedTo);
  }

  if (filters.status && filters.status !== "ALL" && filters.status !== "OVERDUE") {
    whereClause += " AND t.status = ?";
    params.push(filters.status);
  }

  if (filters.status === "OVERDUE") {
    whereClause += " AND t.status <> 'COMPLETED' AND t.deadline < CURDATE()";
  }

  if (filters.priority) {
    whereClause += " AND t.priority = ?";
    params.push(filters.priority);
  }

  if (filters.search) {
    whereClause += `
      AND (
        t.title LIKE ? OR
        t.description LIKE ? OR
        p.name LIKE ? OR
        CONCAT(u.first_name, ' ', u.last_name) LIKE ?
      )
    `;
    const search = `%${filters.search}%`;
    params.push(search, search, search, search);
  }

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total
     FROM tasks t
     INNER JOIN projects p ON t.project_id = p.id
     INNER JOIN users u ON t.assigned_to = u.id
     LEFT JOIN users c ON t.created_by = c.id
     ${whereClause}`,
    params,
  );

  const [tasks] = await db.query(
    `SELECT 
      t.id,
      t.title,
      t.description,
      t.priority,
      t.deadline,
      t.status,
      t.project_id AS projectId,
      t.assigned_to AS assignedTo,
      t.created_by AS createdBy,
      p.name AS projectName,
      CONCAT(u.first_name, ' ', u.last_name) AS assignedToName,
      CONCAT(c.first_name, ' ', c.last_name) AS createdByName,
      c.role AS createdByRole
    FROM tasks t
    INNER JOIN projects p ON t.project_id = p.id
    INNER JOIN users u ON t.assigned_to = u.id
    LEFT JOIN users c ON t.created_by = c.id
    ${whereClause}
    ORDER BY t.created_at DESC
    LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  const total = countRows[0].total;

  return {
    items: tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  };
};

const getTaskById = async (id) => {
  const [tasks] = await db.query(`SELECT * FROM tasks WHERE id = ?`, [id]);

  if (tasks.length === 0) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  return tasks[0];
};

const getMyTasks = async (userId) => {
  await backfillAllManualReportTasks();

  const [tasks] = await db.query(
    `SELECT 
      t.id,
      t.title,
      t.description,
      t.priority,
      t.deadline,
      t.status,
      t.project_id AS projectId,
      p.name AS projectName
    FROM tasks t
    INNER JOIN projects p ON t.project_id = p.id
    WHERE t.assigned_to = ?
    ORDER BY t.created_at DESC`,
    [userId],
  );

  return tasks;
};

const getMyTasksPaginated = async (userId, filters = {}) => {
  await backfillAllManualReportTasks();

  const page = Math.max(Number(filters.page) || 1, 1);
  const limit = Math.min(Math.max(Number(filters.limit) || 8, 1), 50);
  const offset = (page - 1) * limit;

  let whereClause = "WHERE t.assigned_to = ?";
  const params = [userId];

  if (filters.status && filters.status !== "ALL") {
    whereClause += " AND t.status = ?";
    params.push(filters.status);
  }

  if (filters.projectId && filters.projectId !== "ALL") {
    whereClause += " AND t.project_id = ?";
    params.push(filters.projectId);
  }

  if (filters.search) {
    whereClause += " AND (t.title LIKE ? OR t.description LIKE ? OR p.name LIKE ?)";
    const search = `%${filters.search}%`;
    params.push(search, search, search);
  }

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total
     FROM tasks t
     INNER JOIN projects p ON t.project_id = p.id
     ${whereClause}`,
    params,
  );

  const [tasks] = await db.query(
    `SELECT 
      t.id,
      t.title,
      t.description,
      t.priority,
      t.deadline,
      t.status,
      t.project_id AS projectId,
      t.assigned_to AS assignedTo,
      t.created_by AS createdBy,
      p.name AS projectName
    FROM tasks t
    INNER JOIN projects p ON t.project_id = p.id
    ${whereClause}
    ORDER BY t.created_at DESC
    LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  const total = countRows[0].total;

  return {
    items: tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  };
};

const updateTask = async (id, data) => {
  const existingTask = await getTaskById(id);

  const {
    projectId,
    assignedTo,
    title,
    description,
    priority,
    deadline,
    status,
  } = data;

  await db.query(
    `UPDATE tasks
     SET project_id = ?, assigned_to = ?, title = ?, description = ?, 
         priority = ?, deadline = ?, status = ?
     WHERE id = ?`,
    [
      projectId,
      assignedTo,
      title,
      description || null,
      priority,
      deadline || null,
      status,
      id,
    ],
  );

  if (Number(existingTask.assigned_to) !== Number(assignedTo)) {
    const projectName = await getProjectName(projectId);

    await notificationService.createNotification({
      userId: assignedTo,
      title: "Task assigned",
      message: `You were assigned "${title}" for ${projectName}.`,
      type: "TASK_ASSIGNED",
      link: "/member/tasks",
    });
  }

  return getTaskById(id);
};

const deleteTask = async (id) => {
  await getTaskById(id);

  await db.query("DELETE FROM tasks WHERE id = ?", [id]);

  return true;
};

const updateMyTaskStatus = async (taskId, userId, status) => {
  const [tasks] = await db.query(
    `SELECT id, assigned_to FROM tasks WHERE id = ?`,
    [taskId],
  );

  if (tasks.length === 0) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  const task = tasks[0];

  if (task.assigned_to !== userId) {
    const error = new Error("You are not allowed to update this task");
    error.statusCode = 403;
    throw error;
  }

  await db.query(`UPDATE tasks SET status = ? WHERE id = ?`, [status, taskId]);

  return getTaskById(taskId);
};

module.exports = {
  createTask,
  getTasks,
  getTasksPaginated,
  getTaskById,
  getMyTasks,
  getMyTasksPaginated,
  updateTask,
  updateMyTaskStatus,
  deleteTask,
};
