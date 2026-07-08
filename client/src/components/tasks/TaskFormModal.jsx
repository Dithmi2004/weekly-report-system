import { X } from "lucide-react";

import { TASK_STATUS } from "../../utils/constants";
import Button from "../common/Button";

const TaskFormModal = ({
  form,
  editingTask,
  projects,
  members,
  saving,
  onChange,
  onClose,
  onSubmit,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950">
            {editingTask ? "Update Task" : "New Task"}
          </h2>
          <p className="text-sm text-slate-500">
            {editingTask
              ? "Update task details, assignment, deadline, and status."
              : "Create a task and assign it to a project member."}
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
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Project
            <select
              required
              name="projectId"
              value={form.projectId}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Assign To
            <select
              required
              name="assignedTo"
              value={form.assignedTo}
              onChange={onChange}
              disabled={!form.projectId}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
            >
              <option value="">
                {form.projectId ? "Select member" : "Select project first"}
              </option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.firstName} {member.lastName}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm font-semibold text-slate-700">
          Task Title
          <input
            required
            name="title"
            value={form.title}
            onChange={onChange}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Example: Design weekly report form"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={3}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Add task details"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-semibold text-slate-700">
            Priority
            <select
              name="priority"
              value={form.priority}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Deadline
            <input
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Status
            <select
              name="status"
              value={form.status}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value={TASK_STATUS.TODO}>TODO</option>
              <option value={TASK_STATUS.IN_PROGRESS}>IN PROGRESS</option>
              <option value={TASK_STATUS.COMPLETED}>COMPLETED</option>
            </select>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving
              ? editingTask
                ? "Updating..."
                : "Creating..."
              : editingTask
                ? "Update Task"
                : "Create Task"}
          </Button>
        </div>
      </form>
    </div>
  </div>
);

export default TaskFormModal;
