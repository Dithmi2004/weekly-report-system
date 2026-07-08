const Textarea = ({
  label,
  error,
  rows = 4,
  required = false,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <textarea
        rows={rows}
        className={`
          w-full rounded-xl border bg-white px-4 py-3
          text-sm outline-none transition resize-none
          ${
            error
              ? "border-red-400"
              : "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          }
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Textarea;