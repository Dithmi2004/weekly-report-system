const db = require("../config/database");

const getWeekRange = (filters = {}) => {
  if (filters.weekStartDate && filters.weekEndDate) {
    return {
      weekStartDate: filters.weekStartDate,
      weekEndDate: filters.weekEndDate,
    };
  }

  return {
    weekStartDate: "DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)",
    weekEndDate:
      "DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 6 DAY)",
    useCurrentWeekSql: true,
  };
};

const getWeekRangeCondition = (alias, weekRange) => {
  if (weekRange.useCurrentWeekSql) {
    return {
      sql: `${alias}.week_start_date <= ${weekRange.weekEndDate}
        AND ${alias}.week_end_date >= ${weekRange.weekStartDate}`,
      params: [],
    };
  }

  return {
    sql: `${alias}.week_start_date <= ? AND ${alias}.week_end_date >= ?`,
    params: [weekRange.weekEndDate, weekRange.weekStartDate],
  };
};

const getSummary = async (filters = {}) => {
  const weekRange = getWeekRange(filters);
  const weekCondition = getWeekRangeCondition("wr", weekRange);

  const [submitted] = await db.query(`
    SELECT COUNT(*) AS totalSubmitted
    FROM weekly_reports wr
    WHERE wr.status = 'SUBMITTED'
      AND ${weekCondition.sql}
  `, weekCondition.params);

  const [currentCycleSubmissions] = await db.query(`
    SELECT COUNT(DISTINCT wr.user_id) AS submittedMembers
    FROM weekly_reports wr
    INNER JOIN users u ON wr.user_id = u.id
    WHERE wr.status = 'SUBMITTED'
      AND u.role = 'TEAM_MEMBER'
      AND ${weekCondition.sql}
  `, weekCondition.params);

  const [totalMembers] = await db.query(`
    SELECT COUNT(*) AS totalMembers
    FROM users
    WHERE role = 'TEAM_MEMBER'
  `);

  const [openBlockers] = await db.query(`
    SELECT COUNT(*) AS openBlockers
    FROM weekly_reports
    WHERE blockers IS NOT NULL
      AND TRIM(blockers) <> ''
      AND blocker_status = 'OPEN'
  `);

  const complianceRate =
    totalMembers[0].totalMembers === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (currentCycleSubmissions[0].submittedMembers /
              totalMembers[0].totalMembers) *
              100
          )
        );

  return {
    totalSubmitted: submitted[0].totalSubmitted,
    totalMembers: totalMembers[0].totalMembers,
    complianceRate,
    openBlockers: openBlockers[0].openBlockers,
  };
};

const getSubmissionStatus = async (filters = {}) => {
  const weekRange = getWeekRange(filters);
  const weekCondition = getWeekRangeCondition("wr", weekRange);
  const isLateCondition = weekRange.useCurrentWeekSql
    ? "CURDATE() > DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 6 DAY)"
    : "? < CURDATE()";
  const params = [
    ...(weekRange.useCurrentWeekSql ? [] : [weekRange.weekEndDate]),
    ...weekCondition.params,
  ];

  const [rows] = await db.query(`
    SELECT
      CONCAT(u.first_name, ' ', u.last_name) AS memberName,
      CASE
        WHEN COALESCE(MAX(wr.status = 'SUBMITTED'), 0) = 1 THEN 'SUBMITTED'
        WHEN ${isLateCondition} THEN 'LATE'
        ELSE 'PENDING'
      END AS status
    FROM users u
    LEFT JOIN weekly_reports wr
      ON u.id = wr.user_id
      AND ${weekCondition.sql}
    WHERE u.role = 'TEAM_MEMBER'
    GROUP BY u.id, u.first_name, u.last_name
    ORDER BY u.first_name ASC, u.last_name ASC
  `, params);

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
