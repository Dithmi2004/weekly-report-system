import { useCallback, useEffect, useState } from "react";

import { getProjects } from "../../api/projectApi";
import { getAllReports } from "../../api/reportApi";
import { getTeamMembers } from "../../api/userApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ManagerReportFilters from "../../components/reports/ManagerReportFilters";
import ReportList from "../../components/reports/ReportList";
import ReportPageHero from "../../components/reports/ReportPageHero";

const initialFilters = {
  userId: "",
  projectId: "",
  weekStartDate: "",
  weekEndDate: "",
};

const compactFilters = (filters) =>
  Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== "")
  );

const ManagerReports = () => {
  const [reports, setReports] = useState([]);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const [reportData, memberData, projectData] = await Promise.all([
        getAllReports(compactFilters(appliedFilters)),
        getTeamMembers(),
        getProjects(),
      ]);

      setReports(reportData);
      setMembers(memberData);
      setProjects(projectData);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    setAppliedFilters(filters);
  };

  const handleFilterReset = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl text-left">
        <ReportPageHero
          eyebrow="Team reports"
          title="All Weekly Reports"
          description="Review weekly updates across members, projects, and reporting periods."
        />

        <ManagerReportFilters
          filters={filters}
          members={members}
          projects={projects}
          onChange={handleFilterChange}
          onSubmit={handleFilterSubmit}
          onReset={handleFilterReset}
        />

        <ReportList mode="manager" reports={reports} loading={loading} />
      </div>
    </DashboardLayout>
  );
};

export default ManagerReports;
