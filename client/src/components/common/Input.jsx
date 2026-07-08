import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      error,
      icon,
      className = "",
      type = "text",
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            className={`
              w-full rounded-xl border bg-white py-3
              ${icon ? "pl-11" : "pl-4"}
              pr-4
              text-sm
              outline-none
              transition
              ${
                error
                  ? "border-red-400 focus:ring-red-100 focus:border-red-500"
                  : "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              }
              ${className}
            `}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;