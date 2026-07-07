const db = require("../config/database");

const createWeeklyReport = async (userId, data) => {
  const {
    projectId,
    weekStartDate,
    weekEndDate,
    blockers,
    hoursWorked,
    notes,
    completedTaskIds = [],
    plannedTaskIds = [],
    manualCompletedTasks = [],
    manualPlannedTasks = [],
  } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO weekly_reports
       (user_id, project_id, week_start_date, week_end_date, blockers, hours_worked, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'DRAFT')`,
      [
        userId,
        projectId,
        weekStartDate,
        weekEndDate,
        blockers || null,
        hoursWorked || null,
        notes || null,
      ]
    );

    const reportId = result.insertId;

    for (const taskId of completedTaskIds) {
      await connection.query(
        `INSERT INTO weekly_report_tasks
         (weekly_report_id, task_id, report_task_type)
         VALUES (?, ?, 'COMPLETED')`,
        [reportId, taskId]
      );
    }

    for (const taskId of plannedTaskIds) {
      await connection.query(
        `INSERT INTO weekly_report_tasks
         (weekly_report_id, task_id, report_task_type)
         VALUES (?, ?, 'PLANNED')`,
        [reportId, taskId]
      );
    }

    for (const task of manualCompletedTasks) {
      await connection.query(
        `INSERT INTO weekly_report_tasks
         (weekly_report_id, task_id, report_task_type, manual_task_title, manual_task_description)
         VALUES (?, NULL, 'MANUAL_COMPLETED', ?, ?)`,
        [reportId, task.title, task.description || null]
      );
    }

    for (const task of manualPlannedTasks) {
      await connection.query(
        `INSERT INTO weekly_report_tasks
         (weekly_report_id, task_id, report_task_type, manual_task_title, manual_task_description)
         VALUES (?, NULL, 'MANUAL_PLANNED', ?, ?)`,
        [reportId, task.title, task.description || null]
      );
    }

    await connection.commit();

    return getWeeklyReportById(reportId, userId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getWeeklyReportById = async (reportId, userId = null) => {
  let query = `
    SELECT 
      wr.id,
      wr.user_id AS userId,
      CONCAT(u.first_name, ' ', u.last_name) AS memberName,
      wr.project_id AS projectId,
      p.name AS projectName,
      wr.week_start_date AS weekStartDate,
      wr.week_end_date AS weekEndDate,
      wr.blockers,
      wr.hours_worked AS hoursWorked,
      wr.notes,
      wr.status,
      wr.submitted_at AS submittedAt,
      wr.created_at AS createdAt,
      wr.updated_at AS updatedAt
    FROM weekly_reports wr
    INNER JOIN users u ON wr.user_id = u.id
    INNER JOIN projects p ON wr.project_id = p.id
    WHERE wr.id = ?
  `;

  const params = [reportId];

  if (userId) {
    query += " AND wr.user_id = ?";
    params.push(userId);
  }

  const [reports] = await db.query(query, params);

  if (reports.length === 0) {
    const error = new Error("Weekly report not found");
    error.statusCode = 404;
    throw error;
  }

  const report = reports[0];

  const [tasks] = await db.query(
    `SELECT 
      wrt.id,
      wrt.task_id AS taskId,
      wrt.report_task_type AS reportTaskType,
      wrt.manual_task_title AS manualTaskTitle,
      wrt.manual_task_description AS manualTaskDescription,
      t.title AS taskTitle,
      t.description AS taskDescription,
      t.status AS taskStatus,
      t.priority AS taskPriority
     FROM weekly_report_tasks wrt
     LEFT JOIN tasks t ON wrt.task_id = t.id
     WHERE wrt.weekly_report_id = ?`,
    [reportId]
  );

  return {
    ...report,
    tasks,
  };
};

const getMyWeeklyReports = async (userId) => {
  const [reports] = await db.query(
    `SELECT 
      wr.id,
      wr.week_start_date AS weekStartDate,
      wr.week_end_date AS weekEndDate,
      wr.status,
      wr.submitted_at AS submittedAt,
      p.name AS projectName
     FROM weekly_reports wr
     INNER JOIN projects p ON wr.project_id = p.id
     WHERE wr.user_id = ?
     ORDER BY wr.week_start_date DESC`,
    [userId]
  );

  return reports;
};

const updateWeeklyReport = async (reportId, userId, data) => {
  const existingReport = await getWeeklyReportById(reportId, userId);

  if (existingReport.status === "SUBMITTED") {
    const error = new Error("Submitted reports cannot be edited");
    error.statusCode = 400;
    throw error;
  }

  const {
    projectId,
    weekStartDate,
    weekEndDate,
    blockers,
    hoursWorked,
    notes,
    completedTaskIds = [],
    plannedTaskIds = [],
    manualCompletedTasks = [],
    manualPlannedTasks = [],
  } = data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE weekly_reports
       SET project_id = ?, week_start_date = ?, week_end_date = ?, blockers = ?, hours_worked = ?, notes = ?
       WHERE id = ? AND user_id = ?`,
      [
        projectId,
        weekStartDate,
        weekEndDate,
        blockers || null,
        hoursWorked || null,
        notes || null,
        reportId,
        userId,
      ]
    );

    await connection.query(
      `DELETE FROM weekly_report_tasks WHERE weekly_report_id = ?`,
      [reportId]
    );

    for (const taskId of completedTaskIds) {
      await connection.query(
        `INSERT INTO weekly_report_tasks
         (weekly_report_id, task_id, report_task_type)
         VALUES (?, ?, 'COMPLETED')`,
        [reportId, taskId]
      );
    }

    for (const taskId of plannedTaskIds) {
      await connection.query(
        `INSERT INTO weekly_report_tasks
         (weekly_report_id, task_id, report_task_type)
         VALUES (?, ?, 'PLANNED')`,
        [reportId, taskId]
      );
    }

    for (const task of manualCompletedTasks) {
      await connection.query(
        `INSERT INTO weekly_report_tasks
         (weekly_report_id, task_id, report_task_type, manual_task_title, manual_task_description)
         VALUES (?, NULL, 'MANUAL_COMPLETED', ?, ?)`,
        [reportId, task.title, task.description || null]
      );
    }

    for (const task of manualPlannedTasks) {
      await connection.query(
        `INSERT INTO weekly_report_tasks
         (weekly_report_id, task_id, report_task_type, manual_task_title, manual_task_description)
         VALUES (?, NULL, 'MANUAL_PLANNED', ?, ?)`,
        [reportId, task.title, task.description || null]
      );
    }

    await connection.commit();

    return getWeeklyReportById(reportId, userId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const submitWeeklyReport = async (reportId, userId) => {
  const report = await getWeeklyReportById(reportId, userId);

  if (report.status === "SUBMITTED") {
    const error = new Error("Report already submitted");
    error.statusCode = 400;
    throw error;
  }

  await db.query(
    `UPDATE weekly_reports
     SET status = 'SUBMITTED', submitted_at = NOW()
     WHERE id = ? AND user_id = ?`,
    [reportId, userId]
  );

  return getWeeklyReportById(reportId, userId);
};

const getAllReportsForManager = async (filters) => {
  let query = `
    SELECT 
      wr.id,
      CONCAT(u.first_name, ' ', u.last_name) AS memberName,
      p.name AS projectName,
      wr.week_start_date AS weekStartDate,
      wr.week_end_date AS weekEndDate,
      wr.status,
      wr.submitted_at AS submittedAt,
      wr.blockers,
      wr.hours_worked AS hoursWorked
    FROM weekly_reports wr
    INNER JOIN users u ON wr.user_id = u.id
    INNER JOIN projects p ON wr.project_id = p.id
    WHERE 1=1
  `;

  const params = [];

  if (filters.userId) {
    query += " AND wr.user_id = ?";
    params.push(filters.userId);
  }

  if (filters.projectId) {
    query += " AND wr.project_id = ?";
    params.push(filters.projectId);
  }

  if (filters.weekStartDate) {
    query += " AND wr.week_start_date >= ?";
    params.push(filters.weekStartDate);
  }

  if (filters.weekEndDate) {
    query += " AND wr.week_end_date <= ?";
    params.push(filters.weekEndDate);
  }

  query += " ORDER BY wr.week_start_date DESC";

  const [reports] = await db.query(query, params);

  return reports;
};

module.exports = {
  createWeeklyReport,
  getWeeklyReportById,
  getMyWeeklyReports,
  updateWeeklyReport,
  submitWeeklyReport,
  getAllReportsForManager,
};