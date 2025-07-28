import React, { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  type?: string;
  placeholder?: string;
  id: string;
  isNumber?: boolean;
  label: string;
  extraClassName?: string;
  state?: "error" | "success";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      disabled = false,
      state,
      extraClassName,
      label,
      name,
      type = "text",
      placeholder,
      id,
      isNumber = false,
      ...rest
    },
    ref
  ) => {
    const baseClasses =
      "mt-2 w-full rounded-lg border p-3 text-base outline-none placeholder-gray-400 transition-colors focus:border-blue-500";
    const disabledClasses = disabled
      ? "bg-gray-100 border-transparent cursor-not-allowed"
      : "";
    const errorClasses =
      state === "error"
        ? "border-red-500 text-red-600 placeholder-red-500"
        : "";
    const successClasses =
      state === "success"
        ? "border-green-500 text-green-600 placeholder-green-500"
        : "";

    const classes = [
      baseClasses,
      disabledClasses,
      errorClasses,
      successClasses,
      extraClassName,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={extraClassName}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className={classes}
          disabled={disabled}
          ref={ref}
          onKeyDown={(e) => {
            if (
              isNumber &&
              !/[0-9]/.test(e.key) &&
              ![
                "Backspace",
                "Tab",
                "Enter",
                "ArrowLeft",
                "ArrowRight",
              ].includes(e.key)
            ) {
              e.preventDefault();
            }
          }}
          {...rest}
        />
      </div>
    );
  }
);

Input.displayName = "Input";