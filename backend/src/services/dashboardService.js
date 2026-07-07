const db = require("../config/database");

const getSummary = async () => {
  const [submitted] = await db.query(`
    SELECT COUNT(*) AS totalSubmitted
    FROM weekly_reports
    WHERE status = 'SUBMITTED'
  `);

  const [totalMembers] = await db.query(`
    SELECT COUNT(*) AS totalMembers
    FROM users
    WHERE role = 'TEAM_MEMBER'
  `);

  const [openBlockers] = await db.query(`
    SELECT COUNT(*) AS openBlockers
    FROM weekly_reports
    WHERE blockers IS NOT NULL AND blockers <> ''
  `);

  const complianceRate =
    totalMembers[0].totalMembers === 0
      ? 0
      : Math.round((submitted[0].totalSubmitted / totalMembers[0].totalMembers) * 100);

  return {
    totalSubmitted: submitted[0].totalSubmitted,
    totalMembers: totalMembers[0].totalMembers,
    complianceRate,
    openBlockers: openBlockers[0].openBlockers,
  };
};

const getSubmissionStatus = async () => {
  const [rows] = await db.query(`
    SELECT 
      CONCAT(u.first_name, ' ', u.last_name) AS memberName,
      CASE 
        WHEN wr.status = 'SUBMITTED' THEN 'SUBMITTED'
        WHEN wr.status = 'DRAFT' THEN 'PENDING'
        ELSE 'PENDING'
      END AS status
    FROM users u
    LEFT JOIN weekly_reports wr ON u.id = wr.user_id
    WHERE u.role = 'TEAM_MEMBER'
  `);

  return rows;
};

const getProjectDistribution = async () => {
  const [rows] = await db.query(`
    SELECT 
      p.name AS projectName,
      COUNT(wrt.id) AS taskCount
    FROM projects p
    LEFT JOIN weekly_reports wr ON p.id = wr.project_id
    LEFT JOIN weekly_report_tasks wrt ON wr.id = wrt.weekly_report_id
    GROUP BY p.id, p.name
    ORDER BY taskCount DESC
  `);

  return rows;
};

const getTasksTrend = async () => {
  const [rows] = await db.query(`
    SELECT 
      wr.week_start_date AS weekStartDate,
      COUNT(wrt.id) AS completedTasks
    FROM weekly_reports wr
    LEFT JOIN weekly_report_tasks wrt 
      ON wr.id = wrt.weekly_report_id
      AND wrt.report_task_type IN ('COMPLETED', 'MANUAL_COMPLETED')
    GROUP BY wr.week_start_date
    ORDER BY wr.week_start_date ASC
  `);

  return rows;
};

const getRecentActivity = async () => {
  const [rows] = await db.query(`
    SELECT 
      wr.id,
      CONCAT(u.first_name, ' ', u.last_name) AS memberName,
      p.name AS projectName,
      wr.status,
      wr.submitted_at AS submittedAt,
      wr.created_at AS createdAt
    FROM weekly_reports wr
    INNER JOIN users u ON wr.user_id = u.id
    INNER JOIN projects p ON wr.project_id = p.id
    ORDER BY wr.created_at DESC
    LIMIT 10
  `);

  return rows;
};

module.exports = {
  getSummary,
  getSubmissionStatus,
  getProjectDistribution,
  getTasksTrend,
  getRecentActivity,
};