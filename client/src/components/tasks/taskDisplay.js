import { TASK_STATUS } from "../../utils/constants";

export const PAGE_SIZE = 6;

export const managerTaskTabs = [
  { label: "All Tasks", value: "ALL" },
  { label: "To Do", value: TASK_STATUS.TODO },
  { label: "In Progress", value: TASK_STATUS.IN_PROGRESS },
  { label: "Completed", value: TASK_STATUS.COMPLETED },
  { label: "Overdue", value: "OVERDUE" },
];

export const memberTaskTabs = managerTaskTabs.filter(
  (tab) => tab.value !== "OVERDUE"
);

export const statusVariant = {
  [TASK_STATUS.TODO]: "warning",
  [TASK_STATUS.IN_PROGRESS]: "info",
  [TASK_STATUS.COMPLETED]: "success",
  OVERDUE: "danger",
};

export const memberStatusVariant = {
  ...statusVariant,
  [TASK_STATUS.TODO]: "default",
};

export const priorityVariant = {
  LOW: "success",
  MEDIUM: "warning",
  HIGH: "danger",
};

export const memberPriorityVariant = {
  ...priorityVariant,
  LOW: "default",
  MEDIUM: "info",
};

export const nextStatus = {
  [TASK_STATUS.TODO]: TASK_STATUS.IN_PROGRESS,
  [TASK_STATUS.IN_PROGRESS]: TASK_STATUS.COMPLETED,
  [TASK_STATUS.COMPLETED]: TASK_STATUS.COMPLETED,
};

export const initialTaskForm = {
  projectId: "",
  assignedTo: "",
  title: "",
  description: "",
  priority: "MEDIUM",
  deadline: "",
  status: TASK_STATUS.TODO,
};

export const formatStatus = (value) => value?.replaceAll("_", " ") ?? "Unknown";

export const formatDate = (
  value,
  options = { month: "short", day: "numeric", year: "numeric" }
) => {
  if (!value) return "No deadline";
  return new Date(value).toLocaleDateString(undefined, options);
};

export const isOverdue = (task) => {
  if (!task.deadline || task.status === TASK_STATUS.COMPLETED) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.deadline) < today;
};

export const getTaskSummary = (tasks, includeOverdue = false) => ({
  total: tasks.length,
  todo: tasks.filter((task) => task.status === TASK_STATUS.TODO).length,
  inProgress: tasks.filter((task) => task.status === TASK_STATUS.IN_PROGRESS)
    .length,
  completed: tasks.filter((task) => task.status === TASK_STATUS.COMPLETED)
    .length,
  ...(includeOverdue ? { overdue: tasks.filter(isOverdue).length } : {}),
});
