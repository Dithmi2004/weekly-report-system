import { CheckCircle2, Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import Badge from "../common/Badge";
import Button from "../common/Button";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import Loader from "../common/Loader";
import Textarea from "../common/Textarea";

const formatDate = (value) => {
  if (!value) return "No date";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const blockerVariant = {
  OPEN: "danger",
  RESOLVED: "success",
  NONE: "default",
};

const BlockerList = ({ blockers, loading, resolvingReportId, onResolve }) => {
  const [notes, setNotes] = useState({});

  if (loading) {
    return <Loader text="Loading blockers..." />;
  }

  if (blockers.length === 0) {
    return (
      <Card className="mt-4 p-6">
        <EmptyState title="No blockers found" />
      </Card>
    );
  }

  return (
    <div className="mt-4 grid gap-4">
      {blockers.map((report) => (
        <Card key={report.id} className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-bold text-slate-950">
                  {report.projectName}
                </h2>
                <Badge variant={blockerVariant[report.blockerStatus] ?? "danger"}>
                  {report.blockerStatus || "OPEN"}
                </Badge>
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {report.memberName}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Week: {formatDate(report.weekStartDate)} -{" "}
                {formatDate(report.weekEndDate)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {report.blockerStatus !== "RESOLVED" && (
                <Button
                  className="inline-flex items-center gap-2"
                  disabled={resolvingReportId === report.id}
                  onClick={() => onResolve(report.id, notes[report.id] || "")}
                >
                  <CheckCircle2 size={16} />
                  {resolvingReportId === report.id ? "Resolving..." : "Resolve"}
                </Button>
              )}
              <Link
                to={`/manager/reports/${report.id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Eye size={16} />
                View Report
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {report.blockers}
          </div>

          {report.blockerStatus === "RESOLVED" ? (
            <div className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <p className="font-semibold">Resolved</p>
              {report.blockerResolutionNote && (
                <p className="mt-1">{report.blockerResolutionNote}</p>
              )}
            </div>
          ) : (
            <div className="mt-3">
              <Textarea
                label="Resolution note"
                rows={3}
                value={notes[report.id] || ""}
                onChange={(event) =>
                  setNotes((currentNotes) => ({
                    ...currentNotes,
                    [report.id]: event.target.value,
                  }))
                }
                placeholder="Optional note for the team member"
              />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default BlockerList;
