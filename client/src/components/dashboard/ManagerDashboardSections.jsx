import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  FileText,
  LineChart,
  Sparkles,
  Users,
} from "lucide-react";

import Badge from "../common/Badge";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import PageHeader from "../layout/PageHeader";
import StatCard from "./StatCard";

const submissionStatusVariant = {
  SUBMITTED: "success",
  PENDING: "warning",
  LATE: "danger",
};

export const ManagerDashboardHero = ({ summary }) => (
  <section className="mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-slate-50 p-5 shadow-sm sm:p-6">
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          <Sparkles size={14} />
          Weekly overview
        </div>
        <PageHeader
          title="Manager Dashboard"
          subtitle="Track reports, submission health, blockers, and team movement from one clean workspace."
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:min-w-80">
        <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Compliance
          </p>
          <p className="mt-2 text-2xl font-bold text-blue-700">
            {summary?.complianceRate ?? 0}%
          </p>
        </div>
        <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Blockers
          </p>
          <p className="mt-2 text-2xl font-bold text-rose-600">
            {summary?.openBlockers ?? 0}
          </p>
        </div>
      </div>
    </div>
  </section>
);

export const ManagerStats = ({ summary, onOpenBlockers }) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <StatCard
      title="Submitted Reports"
      value={summary?.totalSubmitted ?? 0}
      subtitle="Reports submitted by the team"
      icon={<FileText size={24} />}
      tone="blue"
      trend="Updated from submitted weekly reports"
    />
    <StatCard
      title="Team Members"
      value={summary?.totalMembers ?? 0}
      subtitle="Registered team members"
      icon={<Users size={24} />}
      tone="emerald"
      trend="Active reporting population"
    />
    <StatCard
      title="Compliance Rate"
      value={`${summary?.complianceRate ?? 0}%`}
      subtitle="Submission coverage this cycle"
      icon={<CheckCircle2 size={24} />}
      tone="amber"
      trend="Based on submitted reports vs members"
    />
    <StatCard
      title="Open Blockers"
      value={summary?.openBlockers ?? 0}
      subtitle="Reports that mention blockers"
      icon={<AlertCircle size={24} />}
      tone="rose"
      trend="Click to view blocker reports"
      onClick={onOpenBlockers}
    />
  </div>
);

export const ProjectDistributionCard = ({ items, maxProjectTasks }) => (
  <Card className="p-5 sm:p-6">
    <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="rounded-xl bg-blue-50 p-2 text-blue-600">
          <BarChart3 size={20} />
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            Project Task Distribution
          </h2>
          <p className="text-sm text-slate-500">
            Completed work grouped by project.
          </p>
        </div>
      </div>
    </div>

    {items.length === 0 ? (
      <EmptyState title="No project data" />
    ) : (
      <div className="space-y-5">
        {items.map((item) => {
          const taskCount = Number(item.taskCount) || 0;
          const width = `${Math.max(
            (taskCount / maxProjectTasks) * 100,
            taskCount > 0 ? 8 : 0
          )}%`;

          return (
            <div key={item.projectName}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-semibold text-slate-800">
                  {item.projectName}
                </span>
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {taskCount} tasks
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-blue-600" style={{ width }} />
              </div>
            </div>
          );
        })}
      </div>
    )}
  </Card>
);

export const SubmissionStatusCard = ({ items }) => (
  <Card className="p-5 sm:p-6">
    <div className="mb-5">
      <h2 className="text-lg font-bold text-slate-950">Submission Status</h2>
      <p className="text-sm text-slate-500">
        Who has submitted and who still needs a nudge.
      </p>
    </div>

    {items.length === 0 ? (
      <EmptyState title="No submission data" />
    ) : (
      <div className="max-h-[420px] space-y-3 overflow-auto pr-1">
        {items.map((item, index) => (
          <div
            key={`${item.memberName}-${index}`}
            className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-800">
                {item.memberName}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Weekly report status
              </p>
            </div>
            <Badge variant={submissionStatusVariant[item.status] ?? "default"}>
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    )}
  </Card>
);

export const TasksTrendCard = ({ items, maxCompletedTasks }) => (
  <Card className="p-5 sm:p-6">
    <div className="mb-5 flex items-center gap-2">
      <span className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
        <LineChart size={20} />
      </span>
      <div>
        <h2 className="text-lg font-bold text-slate-950">
          Tasks Completed Trend
        </h2>
        <p className="text-sm text-slate-500">
          Week-by-week completed task volume.
        </p>
      </div>
    </div>

    {items.length === 0 ? (
      <EmptyState title="No task trend data" />
    ) : (
      <div className="space-y-3">
        {items.map((item) => {
          const completedTasks = Number(item.completedTasks) || 0;
          const width = `${Math.max(
            (completedTasks / maxCompletedTasks) * 100,
            completedTasks > 0 ? 8 : 0
          )}%`;

          return (
            <div
              key={item.weekStartDate}
              className="rounded-2xl border border-slate-100 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-600">
                  {new Date(item.weekStartDate).toLocaleDateString()}
                </span>
                <span className="shrink-0 text-sm font-bold text-slate-900">
                  {completedTasks} completed
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width }}
                />
              </div>
            </div>
          );
        })}
      </div>
    )}
  </Card>
);

export const RecentActivityCard = ({ items }) => (
  <Card className="p-5 sm:p-6">
    <div className="mb-5">
      <h2 className="text-lg font-bold text-slate-950">Recent Activity</h2>
      <p className="text-sm text-slate-500">
        Latest report activity across projects.
      </p>
    </div>

    {items.length === 0 ? (
      <EmptyState title="No recent activity" />
    ) : (
      <div className="max-h-[420px] space-y-3 overflow-auto pr-1">
        {items.map((activity) => (
          <div
            key={activity.id}
            className="rounded-2xl border border-slate-100 px-4 py-3 transition hover:border-blue-100 hover:bg-blue-50/40"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-800">
                  {activity.memberName}
                </p>
                <p className="mt-1 truncate text-sm text-slate-500">
                  {activity.projectName}
                </p>
              </div>
              <Badge
                variant={activity.status === "SUBMITTED" ? "success" : "warning"}
              >
                {activity.status}
              </Badge>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              {activity.submittedAt
                ? `Submitted ${new Date(activity.submittedAt).toLocaleDateString()}`
                : `Created ${new Date(activity.createdAt).toLocaleDateString()}`}
            </p>
          </div>
        ))}
      </div>
    )}
  </Card>
);
