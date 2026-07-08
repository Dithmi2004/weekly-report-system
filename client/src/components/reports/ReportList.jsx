import { Edit3, Eye, Send } from "lucide-react";
import { Link } from "react-router-dom";

import { REPORT_STATUS } from "../../utils/constants";
import Badge from "../common/Badge";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import Loader from "../common/Loader";
import {
  formatReportDate,
  formatReportStatus,
  reportStatusVariant,
} from "./reportUtils";

const ReportList = ({ reports, loading, mode, submittingReportId, onSubmit }) => {
  if (loading) {
    return <Loader text="Loading reports..." />;
  }

  if (reports.length === 0) {
    return (
      <Card className="mt-4 p-6">
        <EmptyState title="No reports found" />
      </Card>
    );
  }

  return (
    <Card className="mt-4 overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              {mode === "manager" && <th className="px-6 py-4">Member</th>}
              <th className="px-6 py-4">Project</th>
              <th className="px-6 py-4">Week</th>
              <th className="px-6 py-4">Hours</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-slate-50">
                {mode === "manager" && (
                  <td className="px-6 py-5">
                    <p className="font-semibold text-slate-900">
                      {report.memberName}
                    </p>
                  </td>
                )}
                <td className="px-6 py-5 text-sm font-semibold text-blue-600">
                  {report.projectName}
                </td>
                <td className="px-6 py-5 text-sm text-slate-600">
                  {formatReportDate(report.weekStartDate)} -{" "}
                  {formatReportDate(report.weekEndDate)}
                </td>
                <td className="px-6 py-5 text-sm text-slate-600">
                  {report.hoursWorked ?? "N/A"}
                </td>
                <td className="px-6 py-5">
                  <Badge variant={reportStatusVariant[report.status]}>
                    {formatReportStatus(report.status)}
                  </Badge>
                </td>
                <td className="px-6 py-5 text-sm text-slate-600">
                  {report.submittedAt
                    ? formatReportDate(report.submittedAt)
                    : "Not submitted"}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <Link
                      to={
                        mode === "manager"
                          ? `/manager/reports/${report.id}`
                          : `/member/reports/${report.id}`
                      }
                      className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                      title="View report"
                    >
                      <Eye size={17} />
                    </Link>
                    {mode === "member" && report.status === REPORT_STATUS.DRAFT && (
                      <>
                        <Link
                          to={`/member/reports/${report.id}/edit`}
                          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                          title="Edit draft"
                        >
                          <Edit3 size={17} />
                        </Link>
                        <button
                          className="rounded-xl border border-indigo-100 p-2 text-indigo-600 hover:bg-indigo-50 disabled:opacity-60"
                          disabled={submittingReportId === report.id}
                          onClick={() => onSubmit(report.id)}
                          title="Submit report"
                        >
                          <Send size={17} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ReportList;
