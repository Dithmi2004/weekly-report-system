import { X } from "lucide-react";

import Button from "../common/Button";

const AssignMemberModal = ({
  project,
  members,
  selectedUserId,
  assigning,
  onChange,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Assign Team Member
            </h2>
            <p className="text-sm text-slate-500">
              Add a team member to {project?.name}.
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
          <label className="block text-sm font-semibold text-slate-700">
            Team Member
            <select
              required
              value={selectedUserId}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Select team member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.firstName} {member.lastName} - {member.email}
                </option>
              ))}
            </select>
          </label>

          {members.length === 0 && (
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              No unassigned team members available for this project.
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={assigning || members.length === 0}>
              {assigning ? "Assigning..." : "Assign Member"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignMemberModal;
