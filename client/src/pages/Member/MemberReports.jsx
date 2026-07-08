import { useCallback, useEffect, useMemo, useState } from "react";

import { getMyReports, submitReport } from "../../api/reportApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ReportList from "../../components/reports/ReportList";
import ReportPageHero from "../../components/reports/ReportPageHero";
import { formatReportDate } from "../../components/reports/reportUtils";

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

  const reportGroups = useMemo(() => {
    const groups = filteredReports.reduce((currentGroups, report) => {
      const key = `${report.weekStartDate}-${report.weekEndDate}`;
      const label = `${formatReportDate(report.weekStartDate)} - ${formatReportDate(
        report.weekEndDate
      )}`;

      return {
        ...currentGroups,
        [key]: {
          label,
          reports: [...(currentGroups[key]?.reports ?? []), report],
        },
      };
    }, {});

    return Object.entries(groups)
      .map(([key, group]) => ({ key, ...group }))
      .sort(
        (a, b) =>
          new Date(b.reports[0].weekStartDate) -
          new Date(a.reports[0].weekStartDate)
      );
  }, [filteredReports]);

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

        {loading || filteredReports.length === 0 ? (
          <ReportList
            mode="member"
            reports={filteredReports}
            loading={loading}
            submittingReportId={submittingReportId}
            onSubmit={handleSubmitReport}
          />
        ) : (
          <div className="space-y-5">
            {reportGroups.map((group) => (
              <section key={group.key}>
                <h2 className="mt-5 text-lg font-bold text-slate-950">
                  Week: {group.label}
                </h2>
                <ReportList
                  mode="member"
                  reports={group.reports}
                  loading={false}
                  submittingReportId={submittingReportId}
                  onSubmit={handleSubmitReport}
                />
              </section>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MemberReports;
