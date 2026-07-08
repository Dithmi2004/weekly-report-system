import {
  ChevronLeft,
  ChevronRight,
  Code2,
  Edit3,
  Eye,
  UserPlus,
  Trash2,
} from "lucide-react";

import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";
import Loader from "../common/Loader";

const statusVariant = {
  ACTIVE: "success",
  INACTIVE: "warning",
};

const ProjectTable = ({
  projects,
  loading,
  pagination,
  onPageChange,
  onView,
  onAssign,
  onEdit,
  onDelete,
}) => {
  const showingStart =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const showingEnd = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {loading ? (
        <Loader text="Loading projects..." />
      ) : projects.length === 0 ? (
        <div className="p-6">
          <EmptyState title="No projects found" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Team Members</th>
                  <th className="px-6 py-4">Tasks</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                          <Code2 size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-950">
                            {project.name}
                          </p>
                          <Badge variant={statusVariant[project.status]}>
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-xs px-6 py-5 text-sm text-slate-600">
                      <p className="line-clamp-2">
                        {project.description || "No description"}
                      </p>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                      {project.memberCount ?? 0}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {project.completedTasks ?? 0} / {project.totalTasks ?? 0}
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant={statusVariant[project.status]}>
                        {project.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <div className="min-w-32">
                        <p className="mb-2 text-sm font-semibold text-slate-700">
                          {project.progress ?? 0}%
                        </p>
                        <div className="h-2 rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${project.progress ?? 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                          onClick={() => onView(project)}
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                          onClick={() => onEdit(project)}
                        >
                          <Edit3 size={17} />
                        </button>
                        <button
                          className="rounded-xl border border-indigo-100 p-2 text-indigo-600 hover:bg-indigo-50"
                          onClick={() => onAssign(project)}
                        >
                          <UserPlus size={17} />
                        </button>
                        <button
                          className="rounded-xl border border-red-100 p-2 text-red-600 hover:bg-red-50"
                          onClick={() => onDelete(project)}
                        >
                          <Trash2 size={17} />
                        </button>
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
              projects
            </p>
            <div className="flex items-center gap-2">
              <button
                className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={pagination.page <= 1}
                onClick={() => onPageChange(pagination.page - 1)}
              >
                <ChevronLeft size={18} />
              </button>
              <span className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white">
                {pagination.page}
              </span>
              <button
                className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => onPageChange(pagination.page + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectTable;
