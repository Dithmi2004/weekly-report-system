const TaskTabs = ({ tabs, value, onChange }) => (
  <div className="flex overflow-x-auto border-b border-slate-200 px-4">
    {tabs.map((tab) => (
      <button
        key={tab.value}
        onClick={() => onChange(tab.value)}
        className={`border-b-2 px-4 py-4 text-sm font-semibold transition ${
          value === tab.value
            ? "border-blue-600 text-blue-600"
            : "border-transparent text-slate-500 hover:text-slate-900"
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default TaskTabs;
