import { useCallback, useEffect, useMemo, useState } from "react";

import { getMyReports, submitReport } from "../../api/reportApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ReportList from "../../components/reports/ReportList";
import ReportPageHero from "../../components/reports/ReportPageHero";

const MemberReports = () => {
  const [reports, setReports] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingReportId, setSubmittingReportId] = useState(null);

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      setReports(await getMyReports());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const filteredReports = useMemo(() => {
    const normalizedSearch = search.toLowerCase();
    if (!normalizedSearch) return reports;

    return reports.filter((report) =>
      report.projectName.toLowerCase().includes(normalizedSearch)
    );
  }, [reports, search]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleSubmitReport = async (reportId) => {
    setSubmittingReportId(reportId);
    try {
      await submitReport(reportId);
      await loadReports();
    } finally {
      setSubmittingReportId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl text-left">
        <ReportPageHero
          eyebrow="My reports"
          title="My Reports"
          description="View submitted reports, continue drafts, and create weekly updates."
          searchInput={searchInput}
          searchPlaceholder="Search by project..."
          createPath="/member/reports/create"
          onSearchInputChange={setSearchInput}
          onSearch={handleSearch}
        />

        <ReportList
          mode="member"
          reports={filteredReports}
          loading={loading}
          submittingReportId={submittingReportId}
          onSubmit={handleSubmitReport}
        />
      </div>
    </DashboardLayout>
  );
};

export default MemberReports;
