import React from "react";
const TextInput = ({
  label,
  placeholder,
  classLabel = "form-label",
  className = "",
  classGroup = "",
  register,
  name,
  readonly,
  dvalue,
  error,
  icon,
  disabled,
  id,
  horizontal,
  validate,
  msgTooltip,
  description,
  cols,
  row = 3,
  onChange,
  ...rest
}) => {
  return (
    <div className={`fromGroup  ${error ? "has-error" : ""}  ${horizontal ? "flex" : ""}  ${validate ? "is-valid" : ""} `}>
      {label && (
        <label htmlFor={id} className={`block capitalize ${classLabel}  ${horizontal ? "flex-0 mr-6 md:w-[100px] w-[60px] break-words" : ""}`}>
          {label}
        </label>
      )}
      <div className={`relative ${horizontal ? "flex-1" : ""}`}>
        {name && (
          <textarea
            {...register(name)}
            {...rest}
            className={`${error ? " has-error" : " "} form-control py-2 ${className}  `}
            placeholder={placeholder}
            readOnly={readonly}
            disabled={disabled}
            id={id}
            cols={cols}
            rows={row}
            onChange={onChange}
          ></textarea>
        )}
        {!name && <textarea className={`${error ? " has-error" : " "} form-control py-2 ${className}  `} placeholder={placeholder} readOnly={readonly} disabled={disabled} id={id} cols={cols} rows={row} onChange={onChange}></textarea>}
      </div>
      {/* error and success message*/}
      {error && <div className={` mt-2 ${msgTooltip ? " inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded" : " text-danger-500 block text-sm"}`}>{error.message}</div>}
      {/* validated and success message*/}
      {validate && <div className={` mt-2 ${msgTooltip ? " inline-block bg-success-500 text-white text-[10px] px-2 py-1 rounded" : " text-success-500 block text-sm"}`}>{validate}</div>}
      {/* only description */}
      {description && <span className="input-description">{description}</span>}
    </div>
  );
};

export default TextInput;
