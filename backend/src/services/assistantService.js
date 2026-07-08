const db = require("../config/database");

const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = "gemini-2.5-flash";

const allowedQuestionTerms = [
  "report",
  "reports",
  "weekly",
  "week",
  "team",
  "member",
  "members",
  "manager",
  "project",
  "projects",
  "task",
  "tasks",
  "blocker",
  "blockers",
  "work",
  "worked",
  "completed",
  "planned",
  "deadline",
  "deadlines",
  "submission",
  "submitted",
  "progress",
  "status",
  "summary",
  "summarize",
  "activity",
  "activities",
  "hours",
  "workload",
  "imbalance",
  "risk",
  "risks",
  "overdue",
  "assigned",
  "assignments",
  "dashboard",
];

const refusalMessage =
  "I can only answer questions about this weekly report system, including team activity, projects, tasks, reports, blockers, workload, and submissions.";

const isSystemRelatedQuestion = (question) => {
  const normalized = question.toLowerCase();
  return allowedQuestionTerms.some((term) => normalized.includes(term));
};

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toISOString().slice(0, 10);
};

const formatRows = (rows, formatter) => {
  if (rows.length === 0) return "None";
  return rows.map(formatter).join("\n");
};

const getAssistantContext = async (user) => {
  const isManager = user.role === "MANAGER";
  const reportUserFilter = isManager ? "" : "AND wr.user_id = ?";
  const taskUserFilter = isManager ? "" : "AND t.assigned_to = ?";
  const projectUserFilter = isManager
    ? ""
    : `WHERE EXISTS (
         SELECT 1
         FROM project_members pm
         WHERE pm.project_id = p.id
           AND pm.user_id = ?
       )
       OR EXISTS (
         SELECT 1
         FROM tasks owned_tasks
         WHERE owned_tasks.project_id = p.id
           AND owned_tasks.assigned_to = ?
       )`;

  const reportParams = isManager ? [] : [user.id];
  const taskParams = isManager ? [] : [user.id];
  const projectParams = isManager ? [] : [user.id, user.id];

  const [summaryRows] = await db.query(
    `SELECT
       COUNT(*) AS totalReports,
       SUM(CASE WHEN status = 'SUBMITTED' THEN 1 ELSE 0 END) AS submittedReports,
       SUM(CASE WHEN blockers IS NOT NULL AND TRIM(blockers) <> '' AND blocker_status = 'OPEN' THEN 1 ELSE 0 END) AS openBlockers,
       SUM(CASE WHEN blocker_status = 'RESOLVED' THEN 1 ELSE 0 END) AS resolvedBlockers,
       COALESCE(SUM(hours_worked), 0) AS totalHours
     FROM weekly_reports
     ${isManager ? "" : "WHERE user_id = ?"}`,
    isManager ? [] : [user.id],
  );

  const [reports] = await db.query(
    `SELECT
       wr.id,
       CONCAT(u.first_name, ' ', u.last_name) AS memberName,
       p.name AS projectName,
       wr.week_start_date AS weekStartDate,
       wr.week_end_date AS weekEndDate,
       wr.status,
       wr.hours_worked AS hoursWorked,
       wr.blockers,
       wr.blocker_status AS blockerStatus,
       wr.blocker_resolution_note AS blockerResolutionNote,
       wr.notes
     FROM weekly_reports wr
     INNER JOIN users u ON wr.user_id = u.id
     INNER JOIN projects p ON wr.project_id = p.id
     WHERE 1=1 ${reportUserFilter}
     ORDER BY wr.created_at DESC
     LIMIT 30`,
    reportParams,
  );

  const [tasks] = await db.query(
    `SELECT
       t.title,
       t.status,
       t.priority,
       t.deadline,
       p.name AS projectName,
       CONCAT(u.first_name, ' ', u.last_name) AS assignedToName
     FROM tasks t
     INNER JOIN projects p ON t.project_id = p.id
     INNER JOIN users u ON t.assigned_to = u.id
     WHERE 1=1 ${taskUserFilter}
     ORDER BY t.created_at DESC
     LIMIT 40`,
    taskParams,
  );

  const [workloadRows] = await db.query(
    `SELECT
       CONCAT(u.first_name, ' ', u.last_name) AS memberName,
       COUNT(*) AS totalTasks,
       SUM(CASE WHEN t.status IN ('TODO', 'IN_PROGRESS') THEN 1 ELSE 0 END) AS remainingTasks,
       SUM(CASE WHEN t.status = 'TODO' THEN 1 ELSE 0 END) AS todoTasks,
       SUM(CASE WHEN t.status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS inProgressTasks,
       SUM(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completedTasks
     FROM tasks t
     INNER JOIN users u ON t.assigned_to = u.id
     WHERE 1=1 ${taskUserFilter}
     GROUP BY u.id
     ORDER BY remainingTasks DESC, totalTasks DESC`,
    taskParams,
  );

  const [projects] = await db.query(
    `SELECT
       p.name,
       p.description,
       p.status,
       COUNT(DISTINCT pm.user_id) AS memberCount,
       COUNT(DISTINCT t.id) AS taskCount,
       COUNT(DISTINCT CASE WHEN t.status IN ('TODO', 'IN_PROGRESS') THEN t.id END) AS remainingTaskCount
     FROM projects p
     LEFT JOIN project_members pm ON p.id = pm.project_id
     LEFT JOIN tasks t ON p.id = t.project_id
     ${projectUserFilter}
     GROUP BY p.id
     ORDER BY p.created_at DESC
     LIMIT 25`,
    projectParams,
  );

  const summary = summaryRows[0] || {};

  return `
User scope: ${isManager ? "Manager view across all teams" : `Team member view for ${user.firstName} ${user.lastName}`}

Dashboard summary:
- Total reports: ${Number(summary.totalReports) || 0}
- Submitted reports: ${Number(summary.submittedReports) || 0}
- Open blockers: ${Number(summary.openBlockers) || 0}
- Resolved blockers: ${Number(summary.resolvedBlockers) || 0}
- Total reported hours: ${Number(summary.totalHours) || 0}

Recent reports:
${formatRows(
  reports,
  (report) =>
    `- ${report.projectName} | ${report.memberName} | ${formatDate(report.weekStartDate)} to ${formatDate(report.weekEndDate)} | ${report.status} | hours ${report.hoursWorked ?? "N/A"} | blockers: ${report.blockers || "none"} | blocker status: ${report.blockerStatus || "NONE"} | resolution note: ${report.blockerResolutionNote || "none"} | notes: ${report.notes || "none"}`,
)}

Recent tasks:
${formatRows(
  tasks,
  (task) =>
    `- ${task.title} | project: ${task.projectName} | assigned to: ${task.assignedToName} | ${task.status} | ${task.priority} | deadline: ${formatDate(task.deadline)}`,
)}

Current workload by remaining tasks:
${formatRows(
  workloadRows,
  (member) =>
    `- ${member.memberName} | remaining: ${Number(member.remainingTasks) || 0} | todo: ${Number(member.todoTasks) || 0} | in progress: ${Number(member.inProgressTasks) || 0} | completed: ${Number(member.completedTasks) || 0} | total assigned: ${Number(member.totalTasks) || 0}`,
)}

Projects:
${formatRows(
  projects,
  (project) =>
    `- ${project.name} | ${project.status} | members: ${project.memberCount} | remaining tasks: ${project.remainingTaskCount} | total tasks: ${project.taskCount} | description: ${project.description || "none"}`,
)}
`.trim();
};

const buildSystemInstruction = (user) => `
You are the in-app AI assistant for a Weekly Report System.
Answer only questions about the application data: weekly reports, team activity, projects, tasks, blockers, workload, submissions, deadlines, and dashboard insights.
If a user asks anything outside this system, politely refuse with: "${refusalMessage}"
Use only the provided context. If the context does not contain enough data, say what is missing and suggest a relevant in-app action.
Do not invent people, projects, tasks, dates, or report details.
Keep answers concise and useful. Prefer bullet points for summaries.
When discussing current workload, queue, remaining tasks, or imbalance, count only TODO and IN_PROGRESS tasks. Do not count COMPLETED tasks as remaining workload.
Format answers for a compact chat UI:
- Use short section headings without Markdown symbols.
- Put each bullet on its own line starting with "- ".
- Do not use bold, italics, tables, or raw Markdown formatting.
Keep each bullet under 22 words when possible.
Respect role scope: the current user is ${user.role}. Do not expose data outside the provided context.
`;

const normalizeGeminiModel = (model) => {
  const configuredModel = model || DEFAULT_MODEL;
  return configuredModel
    .replace(/^models\//i, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
};

const extractGeminiText = (data) =>
  data.candidates
    ?.flatMap((candidate) => candidate.content?.parts || [])
    ?.map((part) => part.text)
    ?.filter(Boolean)
    ?.join("\n")
    ?.trim();

const askAssistant = async (user, question) => {
  const trimmedQuestion = question?.trim();

  if (!trimmedQuestion) {
    const error = new Error("Question is required");
    error.statusCode = 400;
    throw error;
  }

  if (!isSystemRelatedQuestion(trimmedQuestion)) {
    return {
      answer: refusalMessage,
      refused: true,
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const error = new Error("AI assistant is not configured. Set GEMINI_API_KEY in backend .env.");
    error.statusCode = 503;
    throw error;
  }

  const context = await getAssistantContext(user);
  const input = `
System data context:
${context}

User question:
${trimmedQuestion}
`.trim();

  const model = normalizeGeminiModel(process.env.GEMINI_MODEL);
  const response = await fetch(
    `${GEMINI_API_BASE_URL}/models/${model}:generateContent`,
    {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: buildSystemInstruction(user) }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: input }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
      },
    }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data?.error?.message || "AI assistant request failed",
    );
    error.statusCode = response.status;
    throw error;
  }

  return {
    answer:
      extractGeminiText(data) ||
      "I could not generate an answer from the available system data.",
    refused: false,
  };
};

module.exports = {
  askAssistant,
};
