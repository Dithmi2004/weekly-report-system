import { useCallback, useEffect, useMemo, useState } from "react";

import { getMyProjects } from "../../api/projectApi";
import { getMyTasks } from "../../api/taskApi";
import MemberProjectDetailsModal from "../../components/projects/MemberProjectDetailsModal";
import MemberProjectGrid from "../../components/projects/MemberProjectGrid";
import MemberProjectHero from "../../components/projects/MemberProjectHero";
import MemberProjectStats from "../../components/projects/MemberProjectStats";
import {
  buildMemberProjectViewModels,
  getMemberProjectSummary,
} from "../../components/projects/memberProjectUtils";
import DashboardLayout from "../../components/layout/DashboardLayout";

const MemberProjects = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const [projectData, taskData] = await Promise.all([
        getMyProjects(),
        getMyTasks(),
      ]);

      setProjects(projectData);
      setTasks(taskData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const projectViewModels = useMemo(
    () => buildMemberProjectViewModels(projects, tasks),
    [projects, tasks]
  );

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return projectViewModels.filter((project) => {
      const matchesStatus = status === "ALL" || project.status === status;
      const matchesSearch =
        !normalizedSearch ||
        project.name.toLowerCase().includes(normalizedSearch) ||
        project.description?.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [projectViewModels, search, status]);

  const summary = useMemo(
    () => getMemberProjectSummary(projectViewModels),
    [projectViewModels]
  );

  const handleSearch = (event) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl text-left">
        <MemberProjectHero
          searchInput={searchInput}
          status={status}
          onSearchInputChange={setSearchInput}
          onStatusChange={handleStatusChange}
          onSearch={handleSearch}
        />

        <MemberProjectStats summary={summary} />

        <MemberProjectGrid
          projects={filteredProjects}
          loading={loading}
          onView={setSelectedProject}
        />
      </div>

      {selectedProject && (
        <MemberProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default MemberProjects;
