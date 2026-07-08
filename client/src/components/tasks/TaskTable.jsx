import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Edit3,
  Eye,
  Trash2,
} from "lucide-react";

import { TASK_STATUS } from "../../utils/constants";
import Badge from "../common/Badge";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import Loader from "../common/Loader";
import {
  formatDate,
  formatStatus,
  isOverdue,
  nextStatus,
  priorityVariant,
  statusVariant,
} from "./taskDisplay";
import TaskTabs from "./TaskTabs";

const TaskPagination = ({ pagination, onPageChange, compact = false }) => {
  const showingStart =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const showingEnd = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Showing {showingStart} to {showingEnd} of {pagination.total} tasks
      </p>
      <div className="flex items-center gap-2">
        <button
          className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={pagination.page <= 1}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          <ChevronLeft size={18} />
        </button>
        {compact ? (
          <span className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white">
            {pagination.page}
          </span>
        ) : (
          Array.from(
            { length: Math.min(pagination.totalPages, 4) },
            (_, index) => index + 1
          ).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                pagination.page === pageNumber
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {pageNumber}
            </button>
          ))
        )}
        <button
          className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const TaskStatusActions = ({ task, updatingTaskId, onStatusUpdate }) => (
  <div className="flex items-center gap-2">
    <select
      value={task.status}
      disabled={updatingTaskId === task.id}
      onChange={(event) => onStatusUpdate(task.id, event.target.value)}
      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
      title="Update status"
    >
      <option value={TASK_STATUS.TODO}>TO DO</option>
      <option value={TASK_STATUS.IN_PROGRESS}>IN PROGRESS</option>
      <option value={TASK_STATUS.COMPLETED}>COMPLETED</option>
    </select>
    {task.status !== TASK_STATUS.COMPLETED && (
      <button
        className="rounded-xl border border-indigo-100 p-2 text-indigo-600 hover:bg-indigo-50 disabled:opacity-60"
        disabled={updatingTaskId === task.id}
        onClick={() => onStatusUpdate(task.id, nextStatus[task.status])}
        title="Move to next status"
      >
        <ArrowRight size={17} />
      </button>
    )}
  </div>
);

const TaskTable = ({
  tasks,
  loading,
  pagination,
  tabs,
  activeTab,
  mode,
  updatingTaskId,
  onTabChange,
  onPageChange,
  onStatusUpdate,
  onView,
  onEdit,
  onDelete,
}) => {
  const isManager = mode === "manager";

  return (
    <Card className="mt-4 overflow-hidden p-0">
      <TaskTabs tabs={tabs} value={activeTab} onChange={onTabChange} />

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
                  {isManager && <th className="px-6 py-4">Assigned To</th>}
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Deadline</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((task) => {
                  const overdue = isOverdue(task);

                  return (
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
                      {isManager && (
                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-900">
                            {task.assignedToName}
                          </p>
                          <p className="text-xs text-slate-500">TEAM MEMBER</p>
                          {task.createdByRole === "TEAM_MEMBER" && (
                            <p className="mt-1 text-xs font-semibold text-indigo-600">
                              Added by {task.createdByName}
                            </p>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-5">
                        <Badge variant={priorityVariant[task.priority]}>
                          {task.priority}
                        </Badge>
                      </td>
                      <td
                        className={`px-6 py-5 text-sm ${
                          overdue ? "font-semibold text-red-600" : "text-slate-600"
                        }`}
                      >
                        {formatDate(task.deadline)}
                      </td>
                      <td className="px-6 py-5">
                        <Badge
                          variant={
                            overdue ? statusVariant.OVERDUE : statusVariant[task.status]
                          }
                        >
                          {overdue ? "OVERDUE" : formatStatus(task.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        {isManager ? (
                          <div className="flex items-center gap-2">
                            <button
                              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                              onClick={() => onView(task)}
                              title="View task"
                            >
                              <Eye size={17} />
                            </button>
                            <button
                              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                              onClick={() => onEdit(task)}
                              title="Edit task"
                            >
                              <Edit3 size={17} />
                            </button>
                            <button
                              className="rounded-xl border border-red-100 p-2 text-red-600 hover:bg-red-50"
                              onClick={() => onDelete(task)}
                              title="Delete task"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        ) : (
                          <TaskStatusActions
                            task={task}
                            updatingTaskId={updatingTaskId}
                            onStatusUpdate={onStatusUpdate}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <TaskPagination
            pagination={pagination}
            onPageChange={onPageChange}
            compact={!isManager}
          />
        </>
      )}
    </Card>
  );
};

export default TaskTable;
