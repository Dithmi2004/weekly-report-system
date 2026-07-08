import { useCallback, useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

import { getAllReports, resolveReportBlocker } from "../../api/reportApi";
import BlockerList from "../../components/blockers/BlockerList";
import DashboardLayout from "../../components/layout/DashboardLayout";

const ManagerBlockers = () => {
  const [blockers, setBlockers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingReportId, setResolvingReportId] = useState(null);

  const loadBlockers = useCallback(async () => {
    setLoading(true);
    try {
      setBlockers(await getAllReports({ hasBlockers: "true" }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlockers();
  }, [loadBlockers]);

  const handleResolve = async (reportId, note) => {
    setResolvingReportId(reportId);
    try {
      const resolvedReport = await resolveReportBlocker(reportId, note);
      setBlockers((currentBlockers) =>
        currentBlockers.map((report) =>
          report.id === reportId
            ? {
                ...report,
                blockerStatus: resolvedReport.blockerStatus,
                blockerResolvedAt: resolvedReport.blockerResolvedAt,
                blockerResolutionNote: resolvedReport.blockerResolutionNote,
              }
            : report
        )
      );
    } finally {
      setResolvingReportId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl text-left">
        <section className="rounded-2xl border border-rose-100 bg-gradient-to-br from-white via-rose-50 to-slate-50 p-5 shadow-sm">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
            <AlertCircle size={14} />
            Blocker review
          </div>
          <h1 className="text-3xl font-bold text-slate-950">Blockers</h1>
          <p className="mt-1 max-w-3xl text-slate-600">
            Review weekly reports that mention blockers, then follow up with the
            team member from the report details.
          </p>
        </section>

        <BlockerList
          blockers={blockers}
          loading={loading}
          resolvingReportId={resolvingReportId}
          onResolve={handleResolve}
        />
      </div>
    </DashboardLayout>
  );
};

export default ManagerBlockers;
