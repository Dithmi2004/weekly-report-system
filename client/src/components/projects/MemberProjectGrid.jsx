import { Eye, FolderKanban } from "lucide-react";

import Badge from "../common/Badge";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import Loader from "../common/Loader";
import { statusVariant } from "./memberProjectUtils";

const MemberProjectGrid = ({ projects, loading, onView }) => {
  if (loading) {
    return <Loader text="Loading projects..." />;
  }

  if (projects.length === 0) {
    return (
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <EmptyState title="No projects found" />
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <article
          key={project.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-100 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FolderKanban size={20} />
              </div>
              <div className="min-w-0">
                <h2 className="truncate font-bold text-slate-950">
                  {project.name}
                </h2>
                <Badge variant={statusVariant[project.status]}>
                  {project.status}
                </Badge>
              </div>
            </div>
            <button
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
              onClick={() => onView(project)}
              title="View project"
            >
              <Eye size={17} />
            </button>
          </div>

          <p className="mt-4 line-clamp-2 min-h-10 text-sm text-slate-600">
            {project.description || "No description"}
          </p>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">Progress</span>
              <span className="font-bold text-blue-600">
                {project.progress ?? 0}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{ width: `${project.progress ?? 0}%` }}
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-xl bg-slate-50 px-3 py-2">
              <p className="font-bold text-slate-950">{project.totalTasks}</p>
              <p className="text-xs text-slate-500">Tasks</p>
            </div>
            <div className="rounded-xl bg-emerald-50 px-3 py-2">
              <p className="font-bold text-emerald-700">
                {project.completedTasks}
              </p>
              <p className="text-xs text-emerald-700">Done</p>
            </div>
            <div className="rounded-xl bg-indigo-50 px-3 py-2">
              <p className="font-bold text-indigo-700">
                {project.remainingTasks}
              </p>
              <p className="text-xs text-indigo-700">Left</p>
            </div>
          </div>

          <Button
            variant="secondary"
            className="mt-5 w-full"
            onClick={() => onView(project)}
          >
            View Details
          </Button>
        </article>
      ))}
    </div>
  );
};

export default MemberProjectGrid;
