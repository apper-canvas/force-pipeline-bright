import { cn } from "@/utils/cn"

const Select = ({
  name,
  label,
  value,
  onChange,
  error,
  disabled,
  required,
  options = [],
  className,
  ...props
}) => {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={cn(
          "w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300",
          disabled && "bg-gray-100 cursor-not-allowed opacity-60"
        )}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export default Select