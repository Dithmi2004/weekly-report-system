import { useCallback, useEffect, useMemo, useState } from "react";

import { createTask, deleteTask, getTasks, updateTask } from "../../api/taskApi";
import { getProjectMembers, getProjects } from "../../api/projectApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DeleteTaskModal from "../../components/tasks/DeleteTaskModal";
import TaskDetailsModal from "../../components/tasks/TaskDetailsModal";
import TaskFormModal from "../../components/tasks/TaskFormModal";
import TaskPageHero from "../../components/tasks/TaskPageHero";
import TaskStats from "../../components/tasks/TaskStats";
import TaskTable from "../../components/tasks/TaskTable";
import {
  formatDate,
  formatStatus,
  getTaskSummary,
  initialTaskForm,
  isOverdue,
  managerTaskTabs,
  PAGE_SIZE,
} from "../../components/tasks/taskDisplay";

const ManagerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [summaryTasks, setSummaryTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
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
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [form, setForm] = useState(initialTaskForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const [pageData, allTasks, projectData] = await Promise.all([
        getTasks({ page, limit: PAGE_SIZE, status, search }),
        getTasks(),
        getProjects(),
      ]);

      setTasks(pageData.items);
      setPagination(pageData.pagination);
      setSummaryTasks(allTasks);
      setProjects(projectData);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    if (!form.projectId) {
      setMembers([]);
      return;
    }

    const loadMembers = async () => {
      const memberData = await getProjectMembers(form.projectId);
      setMembers(memberData);
    };

    loadMembers();
  }, [form.projectId]);

  const summary = useMemo(
    () => getTaskSummary(summaryTasks, true),
    [summaryTasks]
  );

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleTabChange = (value) => {
    setPage(1);
    setStatus(value);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "projectId" ? { assignedTo: "" } : {}),
    }));
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setForm(initialTaskForm);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    const project = projects.find((item) => item.name === task.projectName);

    setEditingTask(task);
    setForm({
      projectId: project?.id ? String(project.id) : "",
      assignedTo: task.assignedTo ? String(task.assignedTo) : "",
      title: task.title ?? "",
      description: task.description ?? "",
      priority: task.priority ?? "MEDIUM",
      deadline: task.deadline ? task.deadline.slice(0, 10) : "",
      status: task.status ?? "TODO",
    });
    setModalOpen(true);
  };

  const closeTaskModal = () => {
    setModalOpen(false);
    setEditingTask(null);
    setForm(initialTaskForm);
  };

  const handleSaveTask = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        projectId: Number(form.projectId),
        assignedTo: Number(form.assignedTo),
        deadline: form.deadline || null,
      };

      if (editingTask) {
        await updateTask(editingTask.id, payload);
      } else {
        await createTask(payload);
      }

      closeTaskModal();
      await loadTasks();
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;

    setDeleting(true);
    try {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
      setSelectedTask(null);
      await loadTasks();
    } finally {
      setDeleting(false);
    }
  };

  const handleExportPdf = () => {
    const rows = summaryTasks
      .map(
        (task) => `
          <tr>
            <td>${task.title}</td>
            <td>${task.projectName}</td>
            <td>${task.assignedToName}</td>
            <td>${task.priority}</td>
            <td>${formatDate(task.deadline)}</td>
            <td>${isOverdue(task) ? "OVERDUE" : formatStatus(task.status)}</td>
          </tr>
        `
      )
      .join("");

    const printWindow = window.open("", "_blank", "width=1100,height=800");
    if (!printWindow) return;

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Task Report</title>
          <style>
            body { font-family: Arial, sans-serif; color: #0f172a; padding: 32px; }
            h1 { margin: 0; font-size: 24px; }
            p { color: #64748b; margin: 8px 0 24px; }
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
            th { background: #eef2ff; color: #1e1b4b; }
            tr:nth-child(even) { background: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>Weekly Report System - Task Report</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Assigned To</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl text-left">
        <TaskPageHero
          eyebrow="Task management"
          title="All Tasks"
          description="View and manage all tasks across projects and team members."
          searchInput={searchInput}
          searchPlaceholder="Search tasks, members, projects..."
          minWidthClass="xl:min-w-[680px]"
          onSearchInputChange={setSearchInput}
          onSearch={handleSearch}
          onExport={handleExportPdf}
          onCreate={openCreateModal}
        />

        <TaskStats
          summary={summary}
          includeOverdue
          totalSubtitle="All tasks created"
        />

        <TaskTable
          mode="manager"
          tasks={tasks}
          loading={loading}
          pagination={pagination}
          tabs={managerTaskTabs}
          activeTab={status}
          onTabChange={handleTabChange}
          onPageChange={setPage}
          onView={setSelectedTask}
          onEdit={openEditModal}
          onDelete={setDeletingTask}
        />
      </div>

      {modalOpen && (
        <TaskFormModal
          form={form}
          editingTask={editingTask}
          projects={projects}
          members={members}
          saving={saving}
          onChange={handleFormChange}
          onClose={closeTaskModal}
          onSubmit={handleSaveTask}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={() => {
            openEditModal(selectedTask);
            setSelectedTask(null);
          }}
          onDelete={() => {
            setDeletingTask(selectedTask);
            setSelectedTask(null);
          }}
        />
      )}

      {deletingTask && (
        <DeleteTaskModal
          task={deletingTask}
          deleting={deleting}
          onClose={() => setDeletingTask(null)}
          onDelete={handleDeleteTask}
        />
      )}
    </DashboardLayout>
  );
};

export default ManagerTasks;
