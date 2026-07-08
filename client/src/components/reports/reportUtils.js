import { REPORT_STATUS } from "../../utils/constants";

export const reportStatusVariant = {
  [REPORT_STATUS.DRAFT]: "warning",
  [REPORT_STATUS.SUBMITTED]: "success",
};

export const formatReportStatus = (value) =>
  value?.replaceAll("_", " ") ?? "Unknown";

export const formatReportDate = (
  value,
  options = { month: "short", day: "numeric", year: "numeric" }
) => {
  if (!value) return "No date";
  return new Date(value).toLocaleDateString(undefined, options);
};

export const toDateInputValue = (value) => {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
};

export const toLocalDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const shiftDateInputValue = (value, dayOffset) => {
  if (!value) return "";

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + dayOffset);

  return toLocalDateInputValue(date);
};

export const initialReportForm = {
  projectId: "",
  weekStartDate: "",
  weekEndDate: "",
  hoursWorked: "",
  blockers: "",
  notes: "",
  completedTaskIds: [],
  plannedTaskIds: [],
  manualCompletedTasks: [],
  manualPlannedTasks: [],
};

export const getTaskTitle = (reportTask) =>
  reportTask.taskTitle || reportTask.manualTaskTitle || "Untitled task";

export const getTaskDescription = (reportTask) =>
  reportTask.taskDescription || reportTask.manualTaskDescription || "";

export const groupReportTasks = (tasks = []) => ({
  completed: tasks.filter((task) =>
    ["COMPLETED", "MANUAL_COMPLETED"].includes(task.reportTaskType)
  ),
  planned: tasks.filter((task) =>
    ["PLANNED", "MANUAL_PLANNED"].includes(task.reportTaskType)
  ),
});

export const buildReportPayload = (form) => ({
  ...form,
  projectId: Number(form.projectId),
  hoursWorked: form.hoursWorked === "" ? null : Number(form.hoursWorked),
  completedTaskIds: form.completedTaskIds.map(Number),
  plannedTaskIds: form.plannedTaskIds.map(Number),
});

export const buildReportFormFromDetail = (report) => {
  const grouped = groupReportTasks(report.tasks);

  return {
    projectId: report.projectId ? String(report.projectId) : "",
    weekStartDate: toDateInputValue(report.weekStartDate),
    weekEndDate: toDateInputValue(report.weekEndDate),
    hoursWorked: report.hoursWorked ?? "",
    blockers: report.blockers ?? "",
    notes: report.notes ?? "",
    completedTaskIds: grouped.completed
      .filter((task) => task.taskId)
      .map((task) => String(task.taskId)),
    plannedTaskIds: grouped.planned
      .filter((task) => task.taskId)
      .map((task) => String(task.taskId)),
    manualCompletedTasks: grouped.completed
      .filter((task) => !task.taskId)
      .map((task) => ({
        title: task.manualTaskTitle ?? "",
        description: task.manualTaskDescription ?? "",
      })),
    manualPlannedTasks: grouped.planned
      .filter((task) => !task.taskId)
      .map((task) => ({
        title: task.manualTaskTitle ?? "",
        description: task.manualTaskDescription ?? "",
      })),
  };
};
