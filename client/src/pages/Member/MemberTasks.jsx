import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  Filter,
  RefreshCw,
  Search,
} from "lucide-react";

import { getMyTasks, updateTaskStatus } from "../../api/taskApi";
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
];

const statusVariant = {
  [TASK_STATUS.TODO]: "warning",
  [TASK_STATUS.IN_PROGRESS]: "info",
  [TASK_STATUS.COMPLETED]: "success",
};

const priorityVariant = {
  LOW: "success",
  MEDIUM: "warning",
  HIGH: "danger",
};

const nextStatus = {
  [TASK_STATUS.TODO]: TASK_STATUS.IN_PROGRESS,
  [TASK_STATUS.IN_PROGRESS]: TASK_STATUS.COMPLETED,
  [TASK_STATUS.COMPLETED]: TASK_STATUS.COMPLETED,
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

const MemberTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [summaryTasks, setSummaryTasks] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const [pageData, allTasks] = await Promise.all([
        getMyTasks({
          page,
          limit: PAGE_SIZE,
          status,
          search,
        }),
        getMyTasks(),
      ]);

      setTasks(pageData.items);
      setPagination(pageData.pagination);
      setSummaryTasks(allTasks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [page, status, search]);

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

  const handleStatusUpdate = async (taskId, nextTaskStatus) => {
    setUpdatingTaskId(taskId);
    try {
      await updateTaskStatus(taskId, nextTaskStatus);
      await loadTasks();
    } finally {
      setUpdatingTaskId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl text-left">
        <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50 to-blue-50 p-5 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                <ClipboardList size={14} />
                My tasks
              </div>
              <h1 className="text-3xl font-bold text-slate-950">My Tasks</h1>
              <p className="mt-1 text-slate-600">
                View and manage all tasks assigned to you.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Tasks are created and assigned by managers.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 sm:flex-row xl:min-w-[520px]"
            >
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search tasks..."
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
            </form>
          </div>
        </section>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Tasks"
            value={summary.total}
            subtitle="All tasks assigned"
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
                          <Badge variant={priorityVariant[task.priority]}>
                            {task.priority}
                          </Badge>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-600">
                          {formatDate(task.deadline)}
                        </td>
                        <td className="px-6 py-5">
                          <Badge variant={statusVariant[task.status]}>
                            {formatStatus(task.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <select
                              value={task.status}
                              disabled={updatingTaskId === task.id}
                              onChange={(event) =>
                                handleStatusUpdate(task.id, event.target.value)
                              }
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                            >
                              <option value={TASK_STATUS.TODO}>TO DO</option>
                              <option value={TASK_STATUS.IN_PROGRESS}>
                                IN PROGRESS
                              </option>
                              <option value={TASK_STATUS.COMPLETED}>
                                COMPLETED
                              </option>
                            </select>
                            {task.status !== TASK_STATUS.COMPLETED && (
                              <button
                                className="rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-60"
                                disabled={updatingTaskId === task.id}
                                onClick={() =>
                                  handleStatusUpdate(
                                    task.id,
                                    nextStatus[task.status]
                                  )
                                }
                              >
                                Next
                              </button>
                            )}
                          </div>
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
                  <span className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white">
                    {pagination.page}
                  </span>
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
    </DashboardLayout>
  );
};

export default MemberTasks;
