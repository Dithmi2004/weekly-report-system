import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getMyReportById, submitReport } from "../../api/reportApi";
import Loader from "../../components/common/Loader";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ReportDetails from "../../components/reports/ReportDetails";
import ReportPageHero from "../../components/reports/ReportPageHero";

const MemberReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingReportId, setSubmittingReportId] = useState(null);

  const loadReport = useCallback(async () => {
    setLoading(true);
    try {
      setReport(await getMyReportById(id));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const handleSubmitReport = async (reportId) => {
    setSubmittingReportId(reportId);
    try {
      setReport(await submitReport(reportId));
    } finally {
      setSubmittingReportId(null);
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
          eyebrow="Report details"
          title="Weekly Report"
          description="View your weekly report details and submit drafts."
        />
        <ReportDetails
          mode="member"
          report={report}
          submittingReportId={submittingReportId}
          onSubmit={handleSubmitReport}
        />
      </div>
    </DashboardLayout>
  );
};

export default MemberReportDetails;
