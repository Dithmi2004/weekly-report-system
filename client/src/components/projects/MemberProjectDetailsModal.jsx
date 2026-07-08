import { X } from "lucide-react";

import Badge from "../common/Badge";
import Button from "../common/Button";
import Card from "../common/Card";
import { statusVariant } from "./memberProjectUtils";

const MemberProjectDetailsModal = ({ project, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
    <Card className="w-full max-w-lg p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950">{project.name}</h2>
          <div className="mt-2">
            <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
          </div>
        </div>
        <button
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      <div className="mt-5 space-y-4 text-sm text-slate-700">
        <p>
          <span className="font-semibold">Description:</span>{" "}
          {project.description || "No description"}
        </p>
        <p>
          <span className="font-semibold">Tasks:</span>{" "}
          {project.completedTasks ?? 0} completed of {project.totalTasks ?? 0}
        </p>
        <p>
          <span className="font-semibold">Remaining:</span>{" "}
          {project.remainingTasks ?? 0} tasks
        </p>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold">Progress</span>
            <span className="font-bold text-blue-600">
              {project.progress ?? 0}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-blue-600"
              style={{ width: `${project.progress ?? 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Card>
  </div>
);

export default MemberProjectDetailsModal;
