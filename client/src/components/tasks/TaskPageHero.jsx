import { ClipboardList, Download, Filter, Plus, Search } from "lucide-react";

import Button from "../common/Button";

const TaskPageHero = ({
  eyebrow,
  title,
  description,
  helperText,
  searchInput,
  searchPlaceholder,
  minWidthClass = "xl:min-w-[520px]",
  onSearchInputChange,
  onSearch,
  onExport,
  onCreate,
}) => (
  <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50 to-blue-50 p-5 shadow-sm">
    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
          <ClipboardList size={14} />
          {eyebrow}
        </div>
        <h1 className="text-3xl font-bold text-slate-950">{title}</h1>
        <p className="mt-1 text-slate-600">{description}</p>
        {helperText && <p className="mt-2 text-sm text-slate-500">{helperText}</p>}
      </div>

      <form
        onSubmit={onSearch}
        className={`flex flex-col gap-3 sm:flex-row ${minWidthClass}`}
      >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            value={searchInput}
            onChange={(event) => onSearchInputChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          className="inline-flex h-12 items-center justify-center gap-2"
        >
          <Filter size={18} />
          Filter
        </Button>
        {onExport && (
          <Button
            type="button"
            variant="outline"
            onClick={onExport}
            className="inline-flex h-12 items-center justify-center gap-2"
          >
            <Download size={18} />
            Export PDF
          </Button>
        )}
        {onCreate && (
          <Button
            type="button"
            onClick={onCreate}
            className="inline-flex h-12 items-center justify-center gap-2"
          >
            <Plus size={18} />
            New Task
          </Button>
        )}
      </form>
    </div>
  </section>
);

export default TaskPageHero;
