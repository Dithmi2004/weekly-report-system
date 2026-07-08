import { useCallback, useEffect, useMemo, useState } from "react";

import { getMyTasks, updateTaskStatus } from "../../api/taskApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import TaskPageHero from "../../components/tasks/TaskPageHero";
import TaskStats from "../../components/tasks/TaskStats";
import TaskTable from "../../components/tasks/TaskTable";
import {
  getTaskSummary,
  memberTaskTabs,
  PAGE_SIZE,
} from "../../components/tasks/taskDisplay";

const MemberTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });
  const [summaryTasks, setSummaryTasks] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const [pageData, allTasks] = await Promise.all([
        getMyTasks({ page, limit: PAGE_SIZE, status, search }),
        getMyTasks(),
      ]);

      setTasks(pageData.items);
      setPagination(pageData.pagination);
      setSummaryTasks(allTasks);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const summary = useMemo(() => getTaskSummary(summaryTasks), [summaryTasks]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleTabChange = (value) => {
    setPage(1);
    setStatus(value);
  };

  const handleStatusUpdate = async (taskId, nextTaskStatus) => {
    setUpdatingTaskId(taskId);
    try {
      await updateTaskStatus(taskId, nextTaskStatus);
      await loadTasks();
    } finally {
      setUpdatingTaskId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl text-left">
        <TaskPageHero
          eyebrow="My tasks"
          title="My Tasks"
          description="View and manage all tasks assigned to you."
          helperText="Tasks are created and assigned by managers."
          searchInput={searchInput}
          searchPlaceholder="Search tasks..."
          onSearchInputChange={setSearchInput}
          onSearch={handleSearch}
        />

        <TaskStats summary={summary} totalSubtitle="All tasks assigned" />

        <TaskTable
          mode="member"
          tasks={tasks}
          loading={loading}
          pagination={pagination}
          tabs={memberTaskTabs}
          activeTab={status}
          updatingTaskId={updatingTaskId}
          onTabChange={handleTabChange}
          onPageChange={setPage}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </DashboardLayout>
  );
};

export default MemberTasks;
