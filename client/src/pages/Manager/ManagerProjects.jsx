import { useEffect, useMemo, useState } from "react";
import { Filter, FolderKanban, Plus, Search, X } from "lucide-react";

import {
  assignProjectMember,
  createProject,
  deleteProject,
  getProjectMembers,
  getProjects,
  updateProject,
} from "../../api/projectApi";
import { getTeamMembers } from "../../api/userApi";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import DashboardLayout from "../../components/layout/DashboardLayout";
import AssignMemberModal from "../../components/projects/AssignMemberModal";
import ProjectFormModal from "../../components/projects/ProjectFormModal";
import ProjectStats from "../../components/projects/ProjectStats";
import ProjectTable from "../../components/projects/ProjectTable";

const PAGE_SIZE = 6;

const initialForm = {
  name: "",
  description: "",
  status: "ACTIVE",
};

const ManagerProjects = () => {
  const [projects, setProjects] = useState([]);
  const [summaryProjects, setSummaryProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [status, setStatus] = useState("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [assigningProject, setAssigningProject] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const [pageData, allProjects, teamMemberData] = await Promise.all([
        getProjects({ page, limit: PAGE_SIZE, status, search }),
        getProjects(),
        getTeamMembers(),
      ]);

      setProjects(pageData.items);
      setPagination(pageData.pagination);
      setSummaryProjects(allProjects);
      setTeamMembers(teamMemberData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [page, status, search]);

  const statusOptions = useMemo(
    () => [
      { label: "All", value: "ALL" },
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
    ],
    []
  );

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleStatusChange = (event) => {
    setPage(1);
    setStatus(event.target.value);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setForm({
      name: project.name ?? "",
      description: project.description ?? "",
      status: project.status ?? "ACTIVE",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProject(null);
    setForm(initialForm);
  };

  const openAssignModal = async (project) => {
    const currentMembers = await getProjectMembers(project.id);
    setAssigningProject(project);
    setProjectMembers(currentMembers);
    setSelectedUserIds([]);
  };

  const closeAssignModal = () => {
    setAssigningProject(null);
    setProjectMembers([]);
    setSelectedUserIds([]);
  };

  const handleSaveProject = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, form);
      } else {
        await createProject(form);
      }

      closeModal();
      await loadProjects();
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deletingProject) return;

    setDeleting(true);
    try {
      await deleteProject(deletingProject.id);
      setDeletingProject(null);
      setSelectedProject(null);
      await loadProjects();
    } finally {
      setDeleting(false);
    }
  };

  const availableMembers = useMemo(() => {
    const assignedIds = new Set(projectMembers.map((member) => member.id));
    return teamMembers.filter((member) => !assignedIds.has(member.id));
  }, [projectMembers, teamMembers]);

  const handleAssignMember = async (event) => {
    event.preventDefault();
    if (!assigningProject || selectedUserIds.length === 0) return;

    setAssigning(true);
    try {
      await Promise.all(
        selectedUserIds.map((userId) =>
          assignProjectMember(assigningProject.id, Number(userId))
        )
      );
      closeAssignModal();
      await loadProjects();
    } finally {
      setAssigning(false);
    }
  };

  const handleAssignMemberToggle = (userId) => {
    setSelectedUserIds((current) =>
      current.includes(userId)
        ? current.filter((selectedId) => selectedId !== userId)
        : [...current, userId]
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl text-left">
        <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50 to-blue-50 p-5 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                <FolderKanban size={14} />
                Project management
              </div>
              <h1 className="text-3xl font-bold text-slate-950">Projects</h1>
              <p className="mt-1 text-slate-600">
                View and manage all projects in the system.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 lg:flex-row xl:min-w-[620px]"
            >
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search projects..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <select
                value={status}
                onChange={handleStatusChange}
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button
                type="submit"
                variant="secondary"
                className="inline-flex h-12 items-center justify-center gap-2"
              >
                <Filter size={18} />
                Filter
              </Button>
              <Button
                type="button"
                onClick={openCreateModal}
                className="inline-flex h-12 items-center justify-center gap-2"
              >
                <Plus size={18} />
                New Project
              </Button>
            </form>
          </div>
        </section>

        <div className="mt-4">
          <ProjectStats projects={summaryProjects} />
        </div>

        <div className="mt-4">
          <ProjectTable
            projects={projects}
            loading={loading}
            pagination={pagination}
            onPageChange={setPage}
            onView={setSelectedProject}
            onAssign={openAssignModal}
            onEdit={openEditModal}
            onDelete={setDeletingProject}
          />
        </div>
      </div>

      {modalOpen && (
        <ProjectFormModal
          form={form}
          editingProject={editingProject}
          saving={saving}
          onChange={handleFormChange}
          onClose={closeModal}
          onSubmit={handleSaveProject}
        />
      )}

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <Card className="w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  {selectedProject.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedProject.status}
                </p>
              </div>
              <button
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                onClick={() => setSelectedProject(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 space-y-3 text-sm text-slate-700">
              <p>
                <span className="font-semibold">Description:</span>{" "}
                {selectedProject.description || "No description"}
              </p>
              <p>
                <span className="font-semibold">Team Members:</span>{" "}
                {selectedProject.memberCount ?? 0}
              </p>
              <p>
                <span className="font-semibold">Tasks:</span>{" "}
                {selectedProject.completedTasks ?? 0} completed of{" "}
                {selectedProject.totalTasks ?? 0}
              </p>
              <p>
                <span className="font-semibold">Progress:</span>{" "}
                {selectedProject.progress ?? 0}%
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  openAssignModal(selectedProject);
                  setSelectedProject(null);
                }}
              >
                Assign Member
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  openEditModal(selectedProject);
                  setSelectedProject(null);
                }}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setDeletingProject(selectedProject);
                  setSelectedProject(null);
                }}
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}

      {assigningProject && (
        <AssignMemberModal
          project={assigningProject}
          members={availableMembers}
          selectedUserIds={selectedUserIds}
          assigning={assigning}
          onToggle={handleAssignMemberToggle}
          onClose={closeAssignModal}
          onSubmit={handleAssignMember}
        />
      )}

      {deletingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <Card className="w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-950">
              Delete Project
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete "{deletingProject.name}"? This
              action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                disabled={deleting}
                onClick={() => setDeletingProject(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                disabled={deleting}
                onClick={handleDeleteProject}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManagerProjects;
