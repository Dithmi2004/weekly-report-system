import { useCallback, useEffect, useMemo, useState } from "react";

import { getMyProjects } from "../../api/projectApi";
import { getMyReports, submitReport } from "../../api/reportApi";
import { getMyTasks, updateTaskStatus } from "../../api/taskApi";
import {
  MemberDashboardHero,
  MemberStats,
  MemberTaskOverviewTable,
  NotificationsCard,
  ProgressChartCard,
  ProjectSummariesCard,
  QuickActionsCard,
  RecentReportsCard,
  UpcomingDeadlinesCard,
  WeeklyReportStatusCard,
} from "../../components/dashboard/MemberDashboardSections";
import Loader from "../../components/common/Loader";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { formatDate } from "../../components/tasks/taskDisplay";
import { REPORT_STATUS, TASK_STATUS } from "../../utils/constants";

const getCurrentWeekRange = () => {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(today);
  start.setDate(today.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const isWithinRange = (value, start, end) => {
  if (!value) return false;
  const date = new Date(value);
  return date >= start && date <= end;
};

const MemberDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [submittingReportId, setSubmittingReportId] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
      const [taskData, reportData, projectData] = await Promise.all([
        getMyTasks(),
        getMyReports(),
        getMyProjects(),
      ]);

      setTasks(taskData);
      setReports(reportData);
      setProjects(projectData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const { currentWeekReport, weekLabel } = useMemo(() => {
    const { start, end } = getCurrentWeekRange();
    const report = reports.find(
      (item) =>
        isWithinRange(item.weekStartDate, start, end) ||
        isWithinRange(item.weekEndDate, start, end)
    );

    return {
      currentWeekReport: report,
      weekLabel: `${formatDate(start, {
        month: "short",
        day: "numeric",
      })} - ${formatDate(end, { month: "short", day: "numeric" })}`,
    };
  }, [reports]);

  const completedTasks = tasks.filter(
    (task) => task.status === TASK_STATUS.COMPLETED
  );
  const inProgressTasks = tasks.filter(
    (task) => task.status === TASK_STATUS.IN_PROGRESS
  );
  const todoTasks = tasks.filter((task) => task.status === TASK_STATUS.TODO);
  const pendingTasks = [...todoTasks, ...inProgressTasks];

  const upcomingDeadlines = tasks
    .filter((task) => task.deadline && task.status !== TASK_STATUS.COMPLETED)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  const recentReports = reports.slice(0, 5);
  const resolvedBlockerNotifications = reports
    .filter(
      (report) =>
        report.blockers?.trim() && report.blockerStatus === "RESOLVED"
    )
    .slice(0, 3)
    .map((report) =>
      report.blockerResolutionNote
        ? `Blocker resolved: ${report.blockerResolutionNote}`
        : `Blocker resolved for ${report.projectName}`
    );

  const projectSummaries = projects.map((project) => {
    const projectTasks = tasks.filter(
      (task) => task.projectName === project.name
    );
    const projectCompleted = projectTasks.filter(
      (task) => task.status === TASK_STATUS.COMPLETED
    ).length;

    return {
      ...project,
      totalTasks: projectTasks.length,
      completedTasks: projectCompleted,
      remainingTasks: projectTasks.length - projectCompleted,
    };
  });

  const notifications = [
    ...resolvedBlockerNotifications,
    ...upcomingDeadlines
      .filter((task) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return (
          task.deadline &&
          new Date(task.deadline).toDateString() === tomorrow.toDateString()
        );
      })
      .map((task) => `Task deadline tomorrow: ${task.title}`),
    !currentWeekReport || currentWeekReport.status !== REPORT_STATUS.SUBMITTED
      ? "Weekly report not submitted"
      : null,
    tasks.length > 0 ? `${tasks.length} assigned tasks in your queue` : null,
  ].filter(Boolean);

  const chartData = {
    labels: ["Completed", "Pending", "In Progress"],
    datasets: [
      {
        data: [completedTasks.length, todoTasks.length, inProgressTasks.length],
        backgroundColor: ["#10b981", "#6366f1", "#2563eb"],
        borderColor: "#ffffff",
        borderWidth: 4,
      },
    ],
  };

  const handleStatusChange = async (taskId, status) => {
    setUpdatingTaskId(taskId);
    try {
      const updatedTask = await updateTaskStatus(taskId, status);
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? { ...task, status: updatedTask.status } : task
        )
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleSubmitReport = async (reportId) => {
    setSubmittingReportId(reportId);
    try {
      const updatedReport = await submitReport(reportId);
      setReports((currentReports) =>
        currentReports.map((report) =>
          report.id === reportId
            ? {
                ...report,
                status: updatedReport.status,
                submittedAt: updatedReport.submittedAt,
              }
            : report
        )
      );
    } finally {
      setSubmittingReportId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loader text="Loading member dashboard..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl text-left">
        <MemberDashboardHero />
        <MemberStats
          tasks={tasks}
          completedTasks={completedTasks}
          pendingTasks={pendingTasks}
          reports={reports}
        />

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
          <WeeklyReportStatusCard
            currentWeekReport={currentWeekReport}
            weekLabel={weekLabel}
            submittingReportId={submittingReportId}
            onSubmitReport={handleSubmitReport}
          />
          <ProgressChartCard tasks={tasks} chartData={chartData} />
        </div>

        <MemberTaskOverviewTable
          tasks={tasks}
          updatingTaskId={updatingTaskId}
          onStatusChange={handleStatusChange}
        />

        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <UpcomingDeadlinesCard tasks={upcomingDeadlines} />
          <RecentReportsCard reports={recentReports} />
          <ProjectSummariesCard projects={projectSummaries} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <NotificationsCard notifications={notifications} />
          <QuickActionsCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemberDashboard;
