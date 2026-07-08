import { Edit3, Trash2, X } from "lucide-react";

import Button from "../common/Button";
import { formatDate } from "./taskDisplay";

const TaskDetailsModal = ({ task, onClose, onEdit, onDelete }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950">{task.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{task.projectName}</p>
        </div>
        <button
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <div className="mt-5 space-y-3 text-sm">
        <p>
          <span className="font-semibold text-slate-700">Assigned:</span>{" "}
          {task.assignedToName}
        </p>
        <p>
          <span className="font-semibold text-slate-700">Deadline:</span>{" "}
          {formatDate(task.deadline)}
        </p>
        <p>
          <span className="font-semibold text-slate-700">Description:</span>{" "}
          {task.description || "No description"}
        </p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="secondary"
          className="inline-flex items-center gap-2"
          onClick={onEdit}
        >
          <Edit3 size={16} />
          Edit
        </Button>
        <Button
          variant="danger"
          className="inline-flex items-center gap-2"
          onClick={onDelete}
        >
          <Trash2 size={16} />
          Delete
        </Button>
      </div>
    </div>
  </div>
);

export default TaskDetailsModal;
