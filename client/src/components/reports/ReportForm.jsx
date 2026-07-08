import { Plus, Trash2 } from "lucide-react";

import Button from "../common/Button";
import Card from "../common/Card";

const emptyManualTask = { title: "", description: "" };

const ManualTaskEditor = ({ title, tasks, onAdd, onChange, onRemove }) => (
  <div>
    <div className="mb-3 flex items-center justify-between">
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <Button
        type="button"
        variant="secondary"
        className="inline-flex items-center gap-2"
        onClick={onAdd}
      >
        <Plus size={16} />
        Add
      </Button>
    </div>

    {tasks.length === 0 ? (
      <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
        No manual tasks added.
      </p>
    ) : (
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div
            key={`${title}-${index}`}
            className="rounded-2xl border border-slate-100 p-4"
          >
            <div className="flex gap-3">
              <input
                value={task.title}
                onChange={(event) => onChange(index, "title", event.target.value)}
                placeholder="Task title"
                className="h-11 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="button"
                className="rounded-xl border border-red-100 p-2 text-red-600 hover:bg-red-50"
                onClick={() => onRemove(index)}
              >
                <Trash2 size={17} />
              </button>
            </div>
            <textarea
              value={task.description}
              onChange={(event) =>
                onChange(index, "description", event.target.value)
              }
              rows={2}
              placeholder="Optional description"
              className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        ))}
      </div>
    )}
  </div>
);

const TaskCheckboxGroup = ({ title, tasks, selectedIds, onToggle }) => (
  <div>
    <h3 className="mb-3 font-semibold text-slate-800">{title}</h3>
    {tasks.length === 0 ? (
      <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
        No tasks available for the selected project.
      </p>
    ) : (
      <div className="max-h-64 space-y-2 overflow-auto rounded-2xl border border-slate-100 p-3">
        {tasks.map((task) => (
          <label
            key={task.id}
            className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 hover:bg-slate-50"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(String(task.id))}
              onChange={() => onToggle(task.id)}
              className="mt-1"
            />
            <span>
              <span className="block font-semibold text-slate-800">
                {task.title}
              </span>
              <span className="text-xs text-slate-500">
                {task.status} - {task.priority}
              </span>
            </span>
          </label>
        ))}
      </div>
    )}
  </div>
);

const ReportForm = ({
  title,
  subtitle,
  form,
  projects,
  completedTasks,
  plannedTasks,
  saving,
  submitLabel,
  onChange,
  onTaskToggle,
  onManualTaskAdd,
  onManualTaskChange,
  onManualTaskRemove,
  onCancel,
  onSubmit,
}) => (
  <Card className="mt-4 p-5 sm:p-6">
    <div className="mb-5">
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>

    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Project
          <select
            required
            name="projectId"
            value={form.projectId}
            onChange={onChange}
            className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
          Hours Worked
          <input
            name="hoursWorked"
            type="number"
            min="0"
            step="0.5"
            value={form.hoursWorked}
            onChange={onChange}
            className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Example: 32"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Week Start
          <input
            required
            name="weekStartDate"
            type="date"
            value={form.weekStartDate}
            onChange={onChange}
            className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Week End
          <input
            required
            name="weekEndDate"
            type="date"
            value={form.weekEndDate}
            onChange={onChange}
            className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </label>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <TaskCheckboxGroup
          title="Completed Tasks"
          tasks={completedTasks}
          selectedIds={form.completedTaskIds}
          onToggle={(taskId) => onTaskToggle("completedTaskIds", taskId)}
        />
        <TaskCheckboxGroup
          title="Planned Tasks"
          tasks={plannedTasks}
          selectedIds={form.plannedTaskIds}
          onToggle={(taskId) => onTaskToggle("plannedTaskIds", taskId)}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ManualTaskEditor
          title="Manual Completed Tasks"
          tasks={form.manualCompletedTasks}
          onAdd={() => onManualTaskAdd("manualCompletedTasks", emptyManualTask)}
          onChange={(index, field, value) =>
            onManualTaskChange("manualCompletedTasks", index, field, value)
          }
          onRemove={(index) => onManualTaskRemove("manualCompletedTasks", index)}
        />
        <ManualTaskEditor
          title="Manual Planned Tasks"
          tasks={form.manualPlannedTasks}
          onAdd={() => onManualTaskAdd("manualPlannedTasks", emptyManualTask)}
          onChange={(index, field, value) =>
            onManualTaskChange("manualPlannedTasks", index, field, value)
          }
          onRemove={(index) => onManualTaskRemove("manualPlannedTasks", index)}
        />
      </div>

      <label className="block text-sm font-semibold text-slate-700">
        Blockers
        <textarea
          name="blockers"
          value={form.blockers}
          onChange={onChange}
          rows={3}
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="Mention blockers, dependencies, or risks"
        />
      </label>

      <label className="block text-sm font-semibold text-slate-700">
        Notes
        <textarea
          name="notes"
          value={form.notes}
          onChange={onChange}
          rows={3}
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="Add weekly summary notes"
        />
      </label>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  </Card>
);

export default ReportForm;
