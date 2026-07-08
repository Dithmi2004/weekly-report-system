import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getMyProjects } from "../../api/projectApi";
import {
  createReport,
  getMyReportById,
  getMyReports,
  updateReport,
} from "../../api/reportApi";
import { getMyTasks } from "../../api/taskApi";
import Loader from "../../components/common/Loader";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ReportForm from "../../components/reports/ReportForm";
import ReportPageHero from "../../components/reports/ReportPageHero";
import {
  buildReportFormFromDetail,
  buildReportPayload,
  initialReportForm,
} from "../../components/reports/reportUtils";
import { REPORT_STATUS, TASK_STATUS } from "../../utils/constants";

const MemberReportFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [submittedCompletedTaskIds, setSubmittedCompletedTaskIds] = useState(
    new Set()
  );
  const [form, setForm] = useState(initialReportForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadFormData = useCallback(async () => {
    setLoading(true);
    try {
      const [projectData, taskData, reportData, reportList] = await Promise.all([
        getMyProjects(),
        getMyTasks(),
        isEditing ? getMyReportById(id) : Promise.resolve(null),
        getMyReports(),
      ]);

      const submittedReports = reportList.filter(
        (report) => report.status === REPORT_STATUS.SUBMITTED
      );
      const submittedReportDetails = await Promise.all(
        submittedReports.map((report) => getMyReportById(report.id))
      );
      const completedTaskIds = new Set(
        submittedReportDetails.flatMap((report) =>
          (report.tasks ?? [])
            .filter(
              (task) => task.reportTaskType === "COMPLETED" && task.taskId
            )
            .map((task) => String(task.taskId))
        )
      );

      setProjects(projectData);
      setTasks(taskData);
      setSubmittedCompletedTaskIds(completedTaskIds);
      setForm(
        reportData ? buildReportFormFromDetail(reportData) : initialReportForm
      );
    } finally {
      setLoading(false);
    }
  }, [id, isEditing]);

  useEffect(() => {
    loadFormData();
  }, [loadFormData]);

  const selectedProject = projects.find(
    (project) => String(project.id) === form.projectId
  );

  const projectTasks = useMemo(() => {
    if (!selectedProject) return [];
    return tasks.filter((task) => String(task.projectId) === form.projectId);
  }, [form.projectId, selectedProject, tasks]);

  const completedTasks = useMemo(
    () =>
      projectTasks.filter(
        (task) =>
          task.status === TASK_STATUS.COMPLETED &&
          !submittedCompletedTaskIds.has(String(task.id))
      ),
    [projectTasks, submittedCompletedTaskIds]
  );

  const plannedTasks = useMemo(
    () =>
      projectTasks.filter((task) =>
        [TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS].includes(task.status)
      ),
    [projectTasks]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "projectId"
        ? { completedTaskIds: [], plannedTaskIds: [] }
        : {}),
    }));
  };

  const handleTaskToggle = (field, taskId) => {
    const value = String(taskId);
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((idValue) => idValue !== value)
        : [...current[field], value],
    }));
  };

  const handleManualTaskAdd = (field, task) => {
    setForm((current) => ({
      ...current,
      [field]: [...current[field], { ...task }],
    }));
  };

  const handleManualTaskChange = (field, index, taskField, value) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].map((task, taskIndex) =>
        taskIndex === index ? { ...task, [taskField]: value } : task
      ),
    }));
  };

  const handleManualTaskRemove = (field, index) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].filter((_, taskIndex) => taskIndex !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const completedTaskIds = new Set(
        completedTasks.map((task) => String(task.id))
      );
      const plannedTaskIds = new Set(plannedTasks.map((task) => String(task.id)));
      const payload = buildReportPayload({
        ...form,
        manualCompletedTasks: form.manualCompletedTasks.filter((task) =>
          task.title.trim()
        ),
        manualPlannedTasks: form.manualPlannedTasks.filter((task) =>
          task.title.trim()
        ),
        completedTaskIds: form.completedTaskIds.filter((taskId) =>
          completedTaskIds.has(taskId)
        ),
        plannedTaskIds: form.plannedTaskIds.filter((taskId) =>
          plannedTaskIds.has(taskId)
        ),
      });
      const report = isEditing
        ? await updateReport(id, payload)
        : await createReport(payload);

      navigate(`/member/reports/${report.id}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loader text="Loading report form..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl text-left">
        <ReportPageHero
          eyebrow={isEditing ? "Edit draft" : "Create report"}
          title={isEditing ? "Edit Draft Report" : "Create Weekly Report"}
          description={
            isEditing
              ? "Update your draft before submitting it."
              : "Create a weekly update for your project work."
          }
        />

        <ReportForm
          title={isEditing ? "Draft Details" : "Weekly Report Details"}
          subtitle="Capture completed work, planned work, blockers, and notes."
          form={form}
          projects={projects}
          completedTasks={completedTasks}
          plannedTasks={plannedTasks}
          saving={saving}
          submitLabel={isEditing ? "Update Draft" : "Save Draft"}
          onChange={handleChange}
          onTaskToggle={handleTaskToggle}
          onManualTaskAdd={handleManualTaskAdd}
          onManualTaskChange={handleManualTaskChange}
          onManualTaskRemove={handleManualTaskRemove}
          onCancel={() => navigate("/member/reports")}
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout>
  );
};

export default MemberReportFormPage;
