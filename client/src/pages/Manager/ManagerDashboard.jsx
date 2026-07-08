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

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState([]);
  const [projectDistribution, setProjectDistribution] = useState([]);
  const [tasksTrend, setTasksTrend] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      const [summaryData, statusData, projectData, trendData, activityData] =
        await Promise.all([
          getDashboardSummary(),
          getSubmissionStatus(),
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
  }, []);

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
