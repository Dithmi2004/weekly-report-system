import { CheckCircle2, FolderKanban, PauseCircle, Users } from "lucide-react";

import StatCard from "../dashboard/StatCard";

const ProjectStats = ({ projects = [] }) => {
  const activeProjects = projects.filter((project) => project.status === "ACTIVE");
  const inactiveProjects = projects.filter(
    (project) => project.status === "INACTIVE"
  );
  const totalMembers = projects.reduce(
    (total, project) => total + Number(project.memberCount || 0),
    0
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Projects"
        value={projects.length}
        subtitle="All projects"
        icon={<FolderKanban size={22} />}
        tone="blue"
      />
      <StatCard
        title="Active Projects"
        value={activeProjects.length}
        subtitle="Currently active"
        icon={<CheckCircle2 size={22} />}
        tone="emerald"
      />
      <StatCard
        title="Inactive Projects"
        value={inactiveProjects.length}
        subtitle="Paused or archived"
        icon={<PauseCircle size={22} />}
        tone="amber"
      />
      <StatCard
        title="Team Members"
        value={totalMembers}
        subtitle="Assigned across projects"
        icon={<Users size={22} />}
        tone="rose"
      />
    </div>
  );
};

export default ProjectStats;
