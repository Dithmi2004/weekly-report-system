import Card from "../common/Card";

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  tone = "blue",
  trend,
  onClick,
}) => {
  const tones = {
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    rose: "bg-rose-50 text-rose-600 ring-rose-100",
  };

  const content = (
    <Card
      className={`p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold leading-none text-slate-950">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-sm leading-5 text-slate-500">{subtitle}</p>
          )}
        </div>

        {icon && (
          <div
            className={`rounded-xl p-2.5 ring-1 ${tones[tone] ?? tones.blue}`}
          >
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
          {trend}
        </div>
      )}
    </Card>
  );

  if (!onClick) return content;

  return (
    <button type="button" className="block w-full text-left" onClick={onClick}>
      {content}
    </button>
  );
};

export default StatCard;
