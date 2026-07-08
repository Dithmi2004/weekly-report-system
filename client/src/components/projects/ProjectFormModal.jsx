import { X } from "lucide-react";

import Button from "../common/Button";

const ProjectFormModal = ({
  form,
  editingProject,
  saving,
  onChange,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              {editingProject ? "Update Project" : "New Project"}
            </h2>
            <p className="text-sm text-slate-500">
              {editingProject
                ? "Update project details and status."
                : "Create a project for your team workspace."}
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
            Project Name
            <input
              required
              name="name"
              value={form.name}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Example: Internal Tooling"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="Describe the project"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Status
            <select
              name="status"
              value={form.status}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving
                ? editingProject
                  ? "Updating..."
                  : "Creating..."
                : editingProject
                  ? "Update Project"
                  : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
