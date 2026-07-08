import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  Edit3,
  Download,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { createTask, deleteTask, getTasks, updateTask } from "../../api/taskApi";
import { getProjectMembers, getProjects } from "../../api/projectApi";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import EmptyState from "../../components/common/EmptyState";
import Loader from "../../components/common/Loader";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import { TASK_STATUS } from "../../utils/constants";

const PAGE_SIZE = 6;

const tabs = [
  { label: "All Tasks", value: "ALL" },
  { label: "To Do", value: TASK_STATUS.TODO },
  { label: "In Progress", value: TASK_STATUS.IN_PROGRESS },
  { label: "Completed", value: TASK_STATUS.COMPLETED },
  { label: "Overdue", value: "OVERDUE" },
];

const statusVariant = {
  [TASK_STATUS.TODO]: "warning",
  [TASK_STATUS.IN_PROGRESS]: "info",
  [TASK_STATUS.COMPLETED]: "success",
  OVERDUE: "danger",
};

const priorityVariant = {
  LOW: "success",
  MEDIUM: "warning",
  HIGH: "danger",
};

const initialForm = {
  projectId: "",
  assignedTo: "",
  title: "",
  description: "",
  priority: "MEDIUM",
  deadline: "",
  status: TASK_STATUS.TODO,
};

const formatStatus = (value) => value?.replaceAll("_", " ") ?? "Unknown";

const formatDate = (value) => {
  if (!value) return "No deadline";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const isOverdue = (task) => {
  if (!task.deadline || task.status === TASK_STATUS.COMPLETED) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.deadline) < today;
};

const ManagerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [summaryTasks, setSummaryTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [status, setStatus] = useState("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const [pageData, allTasks, projectData] = await Promise.all([
        getTasks({ page, limit: PAGE_SIZE, status, search }),
        getTasks(),
        getProjects(),
      ]);

      setTasks(pageData.items);
      setPagination(pageData.pagination);
      setSummaryTasks(allTasks);
      setProjects(projectData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [page, status, search]);

  useEffect(() => {
    if (!form.projectId) {
      setMembers([]);
      return;
    }

    const loadMembers = async () => {
      const memberData = await getProjectMembers(form.projectId);
      setMembers(memberData);
    };

    loadMembers();
  }, [form.projectId]);

  const summary = useMemo(
    () => ({
      total: summaryTasks.length,
      todo: summaryTasks.filter((task) => task.status === TASK_STATUS.TODO)
        .length,
      inProgress: summaryTasks.filter(
        (task) => task.status === TASK_STATUS.IN_PROGRESS
      ).length,
      completed: summaryTasks.filter(
        (task) => task.status === TASK_STATUS.COMPLETED
      ).length,
      overdue: summaryTasks.filter(isOverdue).length,
    }),
    [summaryTasks]
  );

  const showingStart =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const showingEnd = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleTabChange = (value) => {
    setPage(1);
    setStatus(value);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "projectId" ? { assignedTo: "" } : {}),
    }));
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    const project = projects.find((item) => item.name === task.projectName);

    setEditingTask(task);
    setForm({
      projectId: project?.id ? String(project.id) : "",
      assignedTo: task.assignedTo ? String(task.assignedTo) : "",
      title: task.title ?? "",
      description: task.description ?? "",
      priority: task.priority ?? "MEDIUM",
      deadline: task.deadline ? task.deadline.slice(0, 10) : "",
      status: task.status ?? TASK_STATUS.TODO,
    });
    setModalOpen(true);
  };

  const closeTaskModal = () => {
    setModalOpen(false);
    setEditingTask(null);
    setForm(initialForm);
  };

  const handleSaveTask = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        projectId: Number(form.projectId),
        assignedTo: Number(form.assignedTo),
        deadline: form.deadline || null,
      };

      if (editingTask) {
        await updateTask(editingTask.id, payload);
      } else {
        await createTask(payload);
      }

      closeTaskModal();
      await loadTasks();
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;

    setDeleting(true);
    try {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
      setSelectedTask(null);
      await loadTasks();
    } finally {
      setDeleting(false);
    }
  };

  const handleExportPdf = () => {
    const rows = summaryTasks
      .map(
        (task) => `
          <tr>
            <td>${task.title}</td>
            <td>${task.projectName}</td>
            <td>${task.assignedToName}</td>
            <td>${task.priority}</td>
            <td>${formatDate(task.deadline)}</td>
            <td>${isOverdue(task) ? "OVERDUE" : formatStatus(task.status)}</td>
          </tr>
        `
      )
      .join("");

    const printWindow = window.open("", "_blank", "width=1100,height=800");
    if (!printWindow) return;

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Task Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #0f172a;
              padding: 32px;
            }
            h1 {
              margin: 0;
              font-size: 24px;
            }
            p {
              color: #64748b;
              margin: 8px 0 24px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              font-size: 12px;
            }
            th,
            td {
              border: 1px solid #e2e8f0;
              padding: 10px;
              text-align: left;
            }
            th {
              background: #eef2ff;
              color: #1e1b4b;
            }
            tr:nth-child(even) {
              background: #f8fafc;
            }
          </style>
        </head>
        <body>
          <h1>Weekly Report System - Task Report</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Assigned To</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl text-left">
        <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50 to-blue-50 p-5 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                <ClipboardList size={14} />
                Task management
              </div>
              <h1 className="text-3xl font-bold text-slate-950">All Tasks</h1>
              <p className="mt-1 text-slate-600">
                View and manage all tasks across projects and team members.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 lg:flex-row xl:min-w-[680px]"
            >
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search tasks, members, projects..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <Button
                type="submit"
                variant="secondary"
                className="inline-flex h-12 items-center justify-center gap-2"
              >
                <Filter size={18} />
                Filter
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleExportPdf}
                className="inline-flex h-12 items-center justify-center gap-2"
              >
                <Download size={18} />
                Export PDF
              </Button>
              <Button
                type="button"
                onClick={openCreateModal}
                className="inline-flex h-12 items-center justify-center gap-2"
              >
                <Plus size={18} />
                New Task
              </Button>
            </form>
          </div>
        </section>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total Tasks"
            value={summary.total}
            subtitle="All tasks created"
            icon={<ClipboardList size={22} />}
            tone="blue"
          />
          <StatCard
            title="Todo"
            value={summary.todo}
            subtitle="Tasks to start"
            icon={<Clock3 size={22} />}
            tone="amber"
          />
          <StatCard
            title="In Progress"
            value={summary.inProgress}
            subtitle="Tasks in progress"
            icon={<RefreshCw size={22} />}
            tone="blue"
          />
          <StatCard
            title="Completed"
            value={summary.completed}
            subtitle="Finished tasks"
            icon={<CheckCircle2 size={22} />}
            tone="emerald"
          />
          <StatCard
            title="Overdue"
            value={summary.overdue}
            subtitle="Tasks past deadline"
            icon={<CalendarDays size={22} />}
            tone="rose"
          />
        </div>

        <Card className="mt-4 overflow-hidden p-0">
          <div className="flex overflow-x-auto border-b border-slate-200 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`border-b-2 px-4 py-4 text-sm font-semibold transition ${
                  status === tab.value
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <Loader text="Loading tasks..." />
          ) : tasks.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No tasks found" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-6 py-4">Task</th>
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4">Assigned To</th>
                      <th className="px-6 py-4">Priority</th>
                      <th className="px-6 py-4">Deadline</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-slate-50">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                              <ClipboardList size={20} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-950">
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="mt-1 max-w-sm truncate text-sm text-slate-500">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm font-semibold text-blue-600">
                          {task.projectName}
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-900">
                            {task.assignedToName}
                          </p>
                          <p className="text-xs text-slate-500">TEAM MEMBER</p>
                        </td>
                        <td className="px-6 py-5">
                          <Badge variant={priorityVariant[task.priority]}>
                            {task.priority}
                          </Badge>
                        </td>
                        <td
                          className={`px-6 py-5 text-sm ${
                            isOverdue(task)
                              ? "font-semibold text-red-600"
                              : "text-slate-600"
                          }`}
                        >
                          {formatDate(task.deadline)}
                        </td>
                        <td className="px-6 py-5">
                          <Badge
                            variant={
                              isOverdue(task)
                                ? statusVariant.OVERDUE
                                : statusVariant[task.status]
                            }
                          >
                            {isOverdue(task) ? "OVERDUE" : formatStatus(task.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-5">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedTask(task)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Showing {showingStart} to {showingEnd} of {pagination.total}{" "}
                  tasks
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={pagination.page <= 1}
                    onClick={() => setPage((currentPage) => currentPage - 1)}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {Array.from(
                    { length: Math.min(pagination.totalPages, 4) },
                    (_, index) => index + 1
                  ).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`rounded-xl px-4 py-2 text-sm font-bold ${
                        pagination.page === pageNumber
                          ? "bg-blue-600 text-white"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button
                    className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPage((currentPage) => currentPage + 1)}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  {editingTask ? "Update Task" : "New Task"}
                </h2>
                <p className="text-sm text-slate-500">
                  {editingTask
                    ? "Update task details, assignment, deadline, and status."
                    : "Create a task and assign it to a project member."}
                </p>
              </div>
              <button
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                onClick={closeTaskModal}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  Project
                  <select
                    required
                    name="projectId"
                    value={form.projectId}
                    onChange={handleFormChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-semibold text-slate-700">
                  Assign To
                  <select
                    required
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleFormChange}
                    disabled={!form.projectId}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                  >
                    <option value="">
                      {form.projectId ? "Select member" : "Select project first"}
                    </option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.firstName} {member.lastName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block text-sm font-semibold text-slate-700">
                Task Title
                <input
                  required
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Example: Design weekly report form"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Add task details"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="text-sm font-semibold text-slate-700">
                  Priority
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleFormChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Deadline
                  <input
                    name="deadline"
                    type="date"
                    value={form.deadline}
                    onChange={handleFormChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value={TASK_STATUS.TODO}>TODO</option>
                    <option value={TASK_STATUS.IN_PROGRESS}>IN PROGRESS</option>
                    <option value={TASK_STATUS.COMPLETED}>COMPLETED</option>
                  </select>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeTaskModal}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving
                    ? editingTask
                      ? "Updating..."
                      : "Creating..."
                    : editingTask
                      ? "Update Task"
                      : "Create Task"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  {selectedTask.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedTask.projectName}
                </p>
              </div>
              <button
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                onClick={() => setSelectedTask(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <p>
                <span className="font-semibold text-slate-700">Assigned:</span>{" "}
                {selectedTask.assignedToName}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Deadline:</span>{" "}
                {formatDate(selectedTask.deadline)}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Description:</span>{" "}
                {selectedTask.description || "No description"}
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                className="inline-flex items-center gap-2"
                onClick={() => {
                  openEditModal(selectedTask);
                  setSelectedTask(null);
                }}
              >
                <Edit3 size={16} />
                Edit
              </Button>
              <Button
                variant="danger"
                className="inline-flex items-center gap-2"
                onClick={() => {
                  setDeletingTask(selectedTask);
                  setSelectedTask(null);
                }}
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {deletingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-950">Delete Task</h2>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete "{deletingTask.title}"? This action
              cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                disabled={deleting}
                onClick={() => setDeletingTask(null)}
              >
                Cancel
              </Button>
              <Button variant="danger" disabled={deleting} onClick={handleDeleteTask}>
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManagerTasks;
