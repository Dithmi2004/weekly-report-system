import Button from "../common/Button";

const ManagerReportFilters = ({
  filters,
  members,
  projects,
  onChange,
  onSubmit,
  onReset,
}) => (
  <form
    onSubmit={onSubmit}
    className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-5"
  >
    <select
      name="userId"
      value={filters.userId}
      onChange={onChange}
      className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
    >
      <option value="">All members</option>
      {members.map((member) => (
        <option key={member.id} value={member.id}>
          {member.firstName} {member.lastName}
        </option>
      ))}
    </select>

    <select
      name="projectId"
      value={filters.projectId}
      onChange={onChange}
      className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
    >
      <option value="">All projects</option>
      {projects.map((project) => (
        <option key={project.id} value={project.id}>
          {project.name}
        </option>
      ))}
    </select>

    <input
      name="weekStartDate"
      type="date"
      value={filters.weekStartDate}
      onChange={onChange}
      className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
    />
    <input
      name="weekEndDate"
      type="date"
      value={filters.weekEndDate}
      onChange={onChange}
      className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
    />

    <div className="flex gap-2">
      <Button type="submit" className="flex-1">
        Apply
      </Button>
      <Button type="button" variant="secondary" onClick={onReset}>
        Reset
      </Button>
    </div>
  </form>
);

export default ManagerReportFilters;
