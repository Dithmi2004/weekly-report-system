import { CheckCircle2, ClipboardList, FolderKanban, RefreshCw } from "lucide-react";

import StatCard from "../dashboard/StatCard";

const MemberProjectStats = ({ summary }) => (
  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <StatCard
      title="Assigned Projects"
      value={summary.totalProjects}
      subtitle="Projects assigned to you"
      icon={<FolderKanban size={22} />}
      tone="blue"
    />
    <StatCard
      title="Active Projects"
      value={summary.activeProjects}
      subtitle="Currently active work"
      icon={<RefreshCw size={22} />}
      tone="emerald"
    />
    <StatCard
      title="Project Tasks"
      value={summary.totalTasks}
      subtitle="Tasks across projects"
      icon={<ClipboardList size={22} />}
      tone="amber"
    />
    <StatCard
      title="Completed Tasks"
      value={summary.completedTasks}
      subtitle="Finished assigned work"
      icon={<CheckCircle2 size={22} />}
      tone="rose"
    />
  </div>
);

export default MemberProjectStats;
