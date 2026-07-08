const Select = ({
  label,
  options = [],
  error,
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

      <select
        className={`
          w-full rounded-xl border bg-white px-4 py-3
          text-sm outline-none transition
          ${
            error
              ? "border-red-400"
              : "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          }
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;