import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  RefreshCw,
} from "lucide-react";

import StatCard from "../dashboard/StatCard";

const TaskStats = ({ summary, includeOverdue = false, totalSubtitle }) => (
  <div
    className={`mt-4 grid gap-3 sm:grid-cols-2 ${
      includeOverdue ? "xl:grid-cols-5" : "xl:grid-cols-4"
    }`}
  >
    <StatCard
      title="Total Tasks"
      value={summary.total}
      subtitle={totalSubtitle}
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
    {includeOverdue && (
      <StatCard
        title="Overdue"
        value={summary.overdue}
        subtitle="Tasks past deadline"
        icon={<CalendarDays size={22} />}
        tone="rose"
      />
    )}
  </div>
);

export default TaskStats;
