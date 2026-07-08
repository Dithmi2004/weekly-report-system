import { X } from "lucide-react";

import Button from "../common/Button";

const AssignMemberModal = ({
  project,
  members,
  selectedUserIds,
  assigning,
  onToggle,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Assign Team Members
            </h2>
            <p className="text-sm text-slate-500">
              Add one or more team members to {project?.name}.
            </p>
          </div>
          <button
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-6">
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">
              Team Members
            </p>
            <div className="max-h-72 space-y-2 overflow-auto rounded-2xl border border-slate-200 p-3">
              {members.map((member) => {
                const value = String(member.id);
                const checked = selectedUserIds.includes(value);

                return (
                  <label
                    key={member.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 transition ${
                      checked ? "bg-indigo-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(value)}
                      className="mt-1"
                    />
                    <span>
                      <span className="block font-semibold text-slate-800">
                        {member.firstName} {member.lastName}
                      </span>
                      <span className="text-sm text-slate-500">
                        {member.email}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {members.length === 0 && (
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              No unassigned team members available for this project.
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                assigning || members.length === 0 || selectedUserIds.length === 0
              }
            >
              {assigning
                ? "Assigning..."
                : `Assign ${selectedUserIds.length || ""} Member${
                    selectedUserIds.length === 1 ? "" : "s"
                  }`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignMemberModal;
