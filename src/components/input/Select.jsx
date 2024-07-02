import Select from "react-select";

const SelectHook = ({ name, options, value, onChange, label, register, defaultValue, error, placeholder, required, optional, className = "my-react-select-container", classNamePrefix = "my-react-select", isDisabled, isClearable }) => {
  return (
    <div className="select-container">
      <label htmlFor={name} className="block mt-2 mb-2 text-gray-800 dark:text-gray-300 text-sm capitalize cursor-pointer font-medium rtl:text-right rtl:block">
        {label} {required && <span className="text-red-800">*</span>} {optional && <span className="text-sm text-gray-400">(optional)</span>}
      </label>
      <Select
        inputId={name}
        {...register(name)}
        className={`${error?.message ? "border-2 rounded-lg border-red-200" : "border-gray-300"} ${className}`}
        classNamePrefix={classNamePrefix}
        name={name}
        defaultValue={options.find((option) => option.value === defaultValue)}
        options={options}
        value={options.find((option) => option.value === value)}
        onChange={(selectedOption) => onChange(name, selectedOption)}
        placeholder={placeholder}
        required={required}
        isDisabled={isDisabled}
        isClearable={isClearable}
      />
      {error && <div className="error-message mt-1 text-red-500 text-sm">{error.message}</div>}
    </div>
  );
};

export default SelectHook;
