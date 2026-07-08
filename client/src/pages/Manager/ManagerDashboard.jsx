import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getDashboardSummary,
  getProjectDistribution,
  getRecentActivity,
  getSubmissionStatus,
  getTasksTrend,
} from "../../api/dashboardApi";
import {
  ManagerDashboardHero,
  ManagerStats,
  ProjectDistributionCard,
  RecentActivityCard,
  SubmissionStatusCard,
  TasksTrendCard,
} from "../../components/dashboard/ManagerDashboardSections";
import Loader from "../../components/common/Loader";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  shiftDateInputValue,
  toLocalDateInputValue,
} from "../../components/reports/reportUtils";

const getCurrentWeekFilters = () => {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(today);
  start.setDate(today.getDate() + diffToMonday);
  const weekStartDate = toLocalDateInputValue(start);

  return {
    weekStartDate,
    weekEndDate: shiftDateInputValue(weekStartDate, 6),
  };
};

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [weekFilters, setWeekFilters] = useState(getCurrentWeekFilters);
  const [summary, setSummary] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState([]);
  const [projectDistribution, setProjectDistribution] = useState([]);
  const [tasksTrend, setTasksTrend] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryData, statusData, projectData, trendData, activityData] =
        await Promise.all([
          getDashboardSummary(weekFilters),
          getSubmissionStatus(weekFilters),
          getProjectDistribution(),
          getTasksTrend(),
          getRecentActivity(),
        ]);

      setSummary(summaryData);
      setSubmissionStatus(statusData);
      setProjectDistribution(projectData);
      setTasksTrend(trendData);
      setRecentActivity(activityData);
    } finally {
      setLoading(false);
    }
  }, [weekFilters]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const maxProjectTasks = Math.max(
    ...projectDistribution.map((item) => Number(item.taskCount) || 0),
    1
  );

  const maxCompletedTasks = Math.max(
    ...tasksTrend.map((item) => Number(item.completedTasks) || 0),
    1
  );

  const handleWeekChange = (event) => {
    const { name, value } = event.target;
    setWeekFilters((current) => ({
      ...current,
      [name]: value,
      ...(name === "weekStartDate"
        ? { weekEndDate: shiftDateInputValue(value, 6) }
        : {}),
      ...(name === "weekEndDate"
        ? { weekStartDate: shiftDateInputValue(value, -6) }
        : {}),
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loader text="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl text-left">
        <ManagerDashboardHero summary={summary} />
        <div className="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:max-w-xl">
          <label className="text-sm font-semibold text-slate-700">
            Week Start
            <input
              name="weekStartDate"
              type="date"
              value={weekFilters.weekStartDate}
              onChange={handleWeekChange}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Week End
            <input
              name="weekEndDate"
              type="date"
              value={weekFilters.weekEndDate}
              onChange={handleWeekChange}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
        </div>
        <ManagerStats
          summary={summary}
          onOpenBlockers={() => navigate("/manager/blockers")}
        />

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <ProjectDistributionCard
            items={projectDistribution}
            maxProjectTasks={maxProjectTasks}
          />
          <SubmissionStatusCard items={submissionStatus} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <TasksTrendCard
            items={tasksTrend}
            maxCompletedTasks={maxCompletedTasks}
          />
          <RecentActivityCard items={recentActivity} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
