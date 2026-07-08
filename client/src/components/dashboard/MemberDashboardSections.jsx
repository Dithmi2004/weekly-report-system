import { Link } from "react-router-dom";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  FolderKanban,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

import { REPORT_STATUS, TASK_STATUS } from "../../utils/constants";
import Badge from "../common/Badge";
import Button from "../common/Button";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import StatCard from "./StatCard";
import {
  formatDate,
  formatStatus,
  memberPriorityVariant,
  memberStatusVariant,
  nextStatus,
} from "../tasks/taskDisplay";

ChartJS.register(ArcElement, Tooltip, Legend);

const reportStatusVariant = {
  ...memberStatusVariant,
  [REPORT_STATUS.DRAFT]: "warning",
  [REPORT_STATUS.SUBMITTED]: "success",
};

export const MemberDashboardHero = () => (
  <section className="mb-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50 to-blue-50 p-4 shadow-sm sm:p-5">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
          <Sparkles size={14} />
          Team member workspace
        </div>
        <h1 className="text-2xl font-bold text-slate-950">Member Dashboard</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Manage your tasks, submit weekly reports, and track project progress
          from one focused view.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/member/reports/create">
          <Button className="inline-flex items-center gap-2">
            <Plus size={16} />
            Create Weekly Report
          </Button>
        </Link>
        <Link to="/member/tasks">
          <Button variant="secondary">View My Tasks</Button>
        </Link>
      </div>
    </div>
  </section>
);

export const MemberStats = ({ tasks, completedTasks, pendingTasks, reports }) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <StatCard
      title="Assigned Tasks"
      value={tasks.length}
      subtitle="Tasks assigned to you"
      icon={<ClipboardList size={24} />}
      tone="blue"
    />
    <StatCard
      title="Completed Tasks"
      value={completedTasks.length}
      subtitle="Finished task count"
      icon={<CheckCircle2 size={24} />}
      tone="emerald"
    />
    <StatCard
      title="Pending Tasks"
      value={pendingTasks.length}
      subtitle="TODO and in progress"
      icon={<Clock3 size={24} />}
      tone="amber"
    />
    <StatCard
      title="Reports Submitted"
      value={reports.filter((report) => report.status === REPORT_STATUS.SUBMITTED).length}
      subtitle="Submitted weekly reports"
      icon={<FileText size={24} />}
      tone="rose"
    />
  </div>
);

export const WeeklyReportStatusCard = ({
  currentWeekReport,
  weekLabel,
  submittingReportId,
  onSubmitReport,
}) => (
  <Card className="border-indigo-100 p-4 sm:p-5">
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold text-slate-950">
          This Week's Report Status
        </h2>
        <p className="mt-1 text-sm text-slate-500">{weekLabel}</p>
      </div>
      {currentWeekReport && (
        <Badge variant={reportStatusVariant[currentWeekReport.status]}>
          {formatStatus(currentWeekReport.status)}
        </Badge>
      )}
    </div>

    {!currentWeekReport ? (
      <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 p-4">
        <p className="font-semibold text-slate-900">
          No report created for this week.
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Start your weekly report and keep your manager in the loop.
        </p>
        <Link to="/member/reports/create">
          <Button className="mt-4">Create Weekly Report</Button>
        </Link>
      </div>
    ) : currentWeekReport.status === REPORT_STATUS.SUBMITTED ? (
      <div className="flex flex-col gap-3 rounded-2xl bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-emerald-900">
            Submitted successfully
          </p>
          <p className="mt-1 text-sm text-emerald-700">
            Project: {currentWeekReport.projectName}
          </p>
        </div>
        <Link to={`/member/reports/${currentWeekReport.id}`}>
          <Button variant="secondary">View Report</Button>
        </Link>
      </div>
    ) : (
      <div className="rounded-2xl bg-amber-50 p-4">
        <p className="font-semibold text-amber-900">Draft in progress</p>
        <p className="mt-1 text-sm text-amber-700">
          Project: {currentWeekReport.projectName}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to={`/member/reports/${currentWeekReport.id}`}>
            <Button variant="secondary">Continue Report</Button>
          </Link>
          <Button
            className="inline-flex items-center gap-2"
            disabled={submittingReportId === currentWeekReport.id}
            onClick={() => onSubmitReport(currentWeekReport.id)}
          >
            <Send size={16} />
            Submit
          </Button>
        </div>
      </div>
    )}
  </Card>
);

export const ProgressChartCard = ({ tasks, chartData }) => (
  <Card className="p-4 sm:p-5">
    <h2 className="text-lg font-bold text-slate-950">Progress Chart</h2>
    <p className="mt-1 text-sm text-slate-500">
      Your task split by current status.
    </p>
    <div className="mx-auto mt-4 h-56 max-h-56 max-w-56">
      {tasks.length === 0 ? (
        <EmptyState title="No task data" />
      ) : (
        <Pie
          data={chartData}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: { boxWidth: 10, padding: 12 },
              },
            },
          }}
        />
      )}
    </div>
  </Card>
);

export const MemberTaskOverviewTable = ({
  tasks,
  updatingTaskId,
  onStatusChange,
}) => (
  <Card className="mt-4 p-4 sm:p-5">
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-950">My Assigned Tasks</h2>
        <p className="mt-1 text-sm text-slate-500">
          Update task status as work moves from TODO to completed.
        </p>
      </div>
      <Link to="/member/tasks">
        <Button variant="secondary">View All Tasks</Button>
      </Link>
    </div>

    {tasks.length === 0 ? (
      <EmptyState title="No assigned tasks" />
    ) : (
      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Task</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-900">{task.title}</p>
                  {task.description && (
                    <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                      {task.description}
                    </p>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {task.projectName}
                </td>
                <td className="px-4 py-4">
                  <Badge variant={memberPriorityVariant[task.priority]}>
                    {task.priority}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {formatDate(task.deadline)}
                </td>
                <td className="px-4 py-4">
                  <Badge variant={memberStatusVariant[task.status]}>
                    {formatStatus(task.status)}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <select
                    value={task.status}
                    disabled={updatingTaskId === task.id}
                    onChange={(event) => onStatusChange(task.id, event.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                  >
                    <option value={TASK_STATUS.TODO}>TODO</option>
                    <option value={TASK_STATUS.IN_PROGRESS}>IN PROGRESS</option>
                    <option value={TASK_STATUS.COMPLETED}>COMPLETED</option>
                  </select>
                  {task.status !== TASK_STATUS.COMPLETED && (
                    <button
                      className="ml-2 rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-60"
                      disabled={updatingTaskId === task.id}
                      onClick={() => onStatusChange(task.id, nextStatus[task.status])}
                    >
                      Next
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </Card>
);

export const UpcomingDeadlinesCard = ({ tasks }) => (
  <Card className="p-4 sm:p-5">
    <div className="mb-4 flex items-center gap-2">
      <CalendarDays className="text-blue-600" size={20} />
      <h2 className="text-lg font-bold text-slate-950">Upcoming Deadlines</h2>
    </div>
    {tasks.length === 0 ? (
      <EmptyState title="No upcoming deadlines" />
    ) : (
      <div className="max-h-72 space-y-3 overflow-auto pr-1">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-2xl border border-slate-100 p-4">
            <p className="font-semibold text-slate-900">{task.title}</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <Badge variant={memberPriorityVariant[task.priority]}>
                {task.priority}
              </Badge>
              <span className="text-sm font-medium text-slate-500">
                {formatDate(task.deadline, { month: "long", day: "numeric" })}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

export const RecentReportsCard = ({ reports }) => (
  <Card className="p-4 sm:p-5">
    <div className="mb-4 flex items-center gap-2">
      <FileText className="text-indigo-600" size={20} />
      <h2 className="text-lg font-bold text-slate-950">Recent Weekly Reports</h2>
    </div>
    {reports.length === 0 ? (
      <EmptyState title="No weekly reports" />
    ) : (
      <div className="max-h-72 space-y-3 overflow-auto pr-1">
        {reports.map((report) => (
          <div key={report.id} className="rounded-2xl border border-slate-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">
                  {formatDate(report.weekStartDate)} - {formatDate(report.weekEndDate)}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {report.projectName}
                </p>
              </div>
              <Badge variant={reportStatusVariant[report.status]}>
                {formatStatus(report.status)}
              </Badge>
            </div>
            <Link
              className="mt-3 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
              to={`/member/reports/${report.id}`}
            >
              View Report
            </Link>
          </div>
        ))}
      </div>
    )}
  </Card>
);

export const ProjectSummariesCard = ({ projects }) => (
  <Card className="p-4 sm:p-5">
    <div className="mb-4 flex items-center gap-2">
      <FolderKanban className="text-emerald-600" size={20} />
      <h2 className="text-lg font-bold text-slate-950">My Projects</h2>
    </div>
    {projects.length === 0 ? (
      <EmptyState title="No assigned projects" />
    ) : (
      <div className="max-h-72 space-y-3 overflow-auto pr-1">
        {projects.map((project) => (
          <div key={project.id} className="rounded-2xl border border-slate-100 p-4">
            <p className="font-semibold text-slate-900">{project.name}</p>
            <p className="mt-1 text-sm text-slate-500">
              {project.totalTasks} Tasks
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <span className="rounded-xl bg-emerald-50 px-3 py-2 font-semibold text-emerald-700">
                {project.completedTasks} Completed
              </span>
              <span className="rounded-xl bg-indigo-50 px-3 py-2 font-semibold text-indigo-700">
                {project.remainingTasks} Remaining
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

export const NotificationsCard = ({ notifications }) => (
  <Card className="p-4 sm:p-5">
    <div className="mb-4 flex items-center gap-2">
      <AlertCircle className="text-amber-600" size={20} />
      <h2 className="text-lg font-bold text-slate-950">Notifications</h2>
    </div>
    {notifications.length === 0 ? (
      <EmptyState title="No notifications" />
    ) : (
      <div className="max-h-48 space-y-3 overflow-auto pr-1">
        {notifications.map((notification) => (
          <div
            key={notification}
            className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
          >
            {notification}
          </div>
        ))}
      </div>
    )}
  </Card>
);

export const QuickActionsCard = () => (
  <Card className="p-4 sm:p-5">
    <h2 className="text-lg font-bold text-slate-950">Quick Actions</h2>
    <p className="mt-1 text-sm text-slate-500">
      Jump into the common member workflows.
    </p>
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      <Link to="/member/reports/create">
        <Button className="w-full">Create Weekly Report</Button>
      </Link>
      <Link to="/member/tasks">
        <Button className="w-full" variant="secondary">
          View My Tasks
        </Button>
      </Link>
      <Link to="/member/reports">
        <Button className="w-full" variant="secondary">
          View My Reports
        </Button>
      </Link>
    </div>
  </Card>
);
