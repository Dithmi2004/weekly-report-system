import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getManagerReportById, resolveReportBlocker } from "../../api/reportApi";
import Loader from "../../components/common/Loader";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ReportDetails from "../../components/reports/ReportDetails";
import ReportPageHero from "../../components/reports/ReportPageHero";

const ManagerReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolvingReportId, setResolvingReportId] = useState(null);

  const loadReport = useCallback(async () => {
    setLoading(true);
    try {
      setReport(await getManagerReportById(id));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const handleResolveBlocker = async (reportId, note) => {
    setResolvingReportId(reportId);
    try {
      setReport(await resolveReportBlocker(reportId, note));
    } finally {
      setResolvingReportId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loader text="Loading report..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl text-left">
        <ReportPageHero
          eyebrow="Report review"
          title="View Report Details"
          description="Review submitted work, blockers, notes, and planned tasks."
        />
        <ReportDetails
          mode="manager"
          report={report}
          resolvingReportId={resolvingReportId}
          onResolveBlocker={handleResolveBlocker}
        />
      </div>
    </DashboardLayout>
  );
};

export default ManagerReportDetails;
