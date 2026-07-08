import { CheckCircle2, Edit3, Send } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { REPORT_STATUS } from "../../utils/constants";
import Badge from "../common/Badge";
import Button from "../common/Button";
import Card from "../common/Card";
import Textarea from "../common/Textarea";
import {
  formatReportDate,
  formatReportStatus,
  getTaskDescription,
  getTaskTitle,
  groupReportTasks,
  reportStatusVariant,
} from "./reportUtils";

const ReportTaskSection = ({ title, tasks }) => (
  <div>
    <h3 className="mb-3 font-semibold text-slate-800">{title}</h3>
    {tasks.length === 0 ? (
      <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
        No tasks recorded.
      </p>
    ) : (
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-2xl border border-slate-100 p-4">
            <p className="font-semibold text-slate-900">{getTaskTitle(task)}</p>
            {getTaskDescription(task) && (
              <p className="mt-1 text-sm text-slate-500">
                {getTaskDescription(task)}
              </p>
            )}
            {task.taskPriority && (
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {task.taskStatus} · {task.taskPriority}
              </p>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

const ReportDetails = ({
  report,
  mode,
  submittingReportId,
  resolvingReportId,
  onSubmit,
  onResolveBlocker,
}) => {
  const [resolutionNote, setResolutionNote] = useState(
    report.blockerResolutionNote || "",
  );
  const groupedTasks = groupReportTasks(report.tasks);

  return (
    <Card className="mt-4 p-5 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-950">
              {report.projectName}
            </h2>
            <Badge variant={reportStatusVariant[report.status]}>
              {formatReportStatus(report.status)}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {formatReportDate(report.weekStartDate)} -{" "}
            {formatReportDate(report.weekEndDate)}
          </p>
          {mode === "manager" && (
            <p className="mt-1 text-sm font-semibold text-slate-700">
              Submitted by {report.memberName}
            </p>
          )}
        </div>

        {mode === "member" && report.status === REPORT_STATUS.DRAFT && (
          <div className="flex gap-2">
            <Link to={`/member/reports/${report.id}/edit`}>
              <Button variant="secondary" className="inline-flex items-center gap-2">
                <Edit3 size={16} />
                Edit Draft
              </Button>
            </Link>
            <Button
              className="inline-flex items-center gap-2"
              disabled={submittingReportId === report.id}
              onClick={() => onSubmit(report.id)}
            >
              <Send size={16} />
              Submit
            </Button>
          </div>
        )}

        {mode === "manager" && report.blockers && (
          <Button
            className="inline-flex items-center gap-2"
            disabled={
              report.blockerStatus === "RESOLVED" ||
              resolvingReportId === report.id
            }
            onClick={() => onResolveBlocker(report.id, resolutionNote)}
          >
            <CheckCircle2 size={16} />
            {report.blockerStatus === "RESOLVED"
              ? "Resolved"
              : resolvingReportId === report.id
                ? "Resolving..."
                : "Resolve Blocker"}
          </Button>
        )}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Hours Worked
          </p>
          <p className="mt-2 text-xl font-bold text-slate-950">
            {report.hoursWorked ?? "N/A"}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Submitted
          </p>
          <p className="mt-2 text-sm font-bold text-slate-950">
            {report.submittedAt
              ? formatReportDate(report.submittedAt)
              : "Not submitted"}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Blockers
          </p>
          <p className="mt-2 text-sm font-bold text-slate-950">
            {report.blockers ? "Reported" : "None"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <ReportTaskSection title="Completed Work" tasks={groupedTasks.completed} />
        <ReportTaskSection title="Planned Work" tasks={groupedTasks.planned} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <div>
          <h3 className="mb-3 font-semibold text-slate-800">Blockers</h3>
          <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            {report.blockers || "No blockers reported."}
          </p>
          {report.blockers && (
            <div className="mt-3">
              {report.blockerStatus === "RESOLVED" ? (
                <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
                  <p className="font-semibold">Resolved blocker</p>
                  <p className="mt-1 text-emerald-800">
                    {report.blockers}
                  </p>
                  {report.blockerResolutionNote && (
                    <p className="mt-3 rounded-xl bg-white/70 px-3 py-2">
                      {report.blockerResolutionNote}
                    </p>
                  )}
                  {report.blockerResolvedAt && (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      Resolved on {formatReportDate(report.blockerResolvedAt)}
                    </p>
                  )}
                </div>
              ) : mode === "manager" ? (
                <Textarea
                  label="Resolution note"
                  rows={3}
                  value={resolutionNote}
                  onChange={(event) => setResolutionNote(event.target.value)}
                  placeholder="Optional note for the team member"
                />
              ) : null}
            </div>
          )}
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-slate-800">Notes</h3>
          <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            {report.notes || "No notes added."}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ReportDetails;
