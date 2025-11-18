"use client";
import { useState } from "react";

interface AuthInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  showToggle?: boolean;
  readOnly?: boolean;

  // 🔹 NEW optional style overrides
  wrapperClass?: string;
  labelClass?: string;
  inputClass?: string;
  errorClass?: string;
}

export default function AuthInput({
  label,
  type = "text",
  value,
  onChange,
  error,
  showToggle = false,
  readOnly = false,

  // 🔹 Default to empty so original styling stays untouched
  wrapperClass = "",
  labelClass = "",
  inputClass = "",
  errorClass = "",
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" && showToggle
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className={`${wrapperClass}`}>
      <label
        className={`block mb-1.5 ${labelClass}`}
      >
        {label}
      </label>

      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          className={`w-full px-3 py-3 focus:outline-none focus:ring-0 font-normal text-[#000000] text-sm 
            transition-colors ${
              error
                ? "border-red-300 focus:border-red-500"
                : ""
            }
            ${inputClass}
          `}
        />

        {type === "password" && showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? (
              // open eye
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#5272FF" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            ) : (
              // closed eye
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 14" fill="none">
                <path d="M9.11958 9.82668L13.1464 13.8536C13.3417 14.0488 13.6583 14.0488 13.8536 13.8536C14.0488 13.6583 14.0488 13.3417 13.8536 13.1464L0.853553 0.146447C0.658291 -0.0488155 0.341709 -0.0488155 0.146447 0.146446C-0.0488156 0.341709 -0.0488155 0.658291 0.146447 0.853553L3.37624 4.08334C2.90117 4.4183 2.5126 4.80026 2.19877 5.18295C1.75443 5.72477 1.46154 6.26493 1.27931 6.66977C1.18795 6.87274 1.12369 7.04329 1.08166 7.1653C1.06063 7.22636 1.03453 7.31047 1.03453 7.31047L1.01687 7.37186C1.01687 7.37186 0.940979 7.86907 1.37202 7.9833C1.63879 8.05404 1.91251 7.8948 1.98346 7.62815L1.98444 7.62471L1.99179 7.5997C1.9989 7.57616 2.01051 7.53927 2.02715 7.49095C2.06047 7.39421 2.11375 7.25227 2.19119 7.08023C2.34655 6.73507 2.59627 6.27523 2.97201 5.81706C3.26363 5.46146 3.63213 5.10494 4.09595 4.80306L5.67356 6.38067C4.9688 6.82277 4.50024 7.60667 4.50024 8.5C4.50024 9.88071 5.61953 11 7.00024 11C7.89358 11 8.67747 10.5314 9.11958 9.82668Z" fill="#5272FF"/>
              </svg>
            )}
          </button>
        )}
      </div>

      {error && (
        <p className={`text-red-500 text-xs font-medium mt-1 ${errorClass}`}>
          {error}
        </p>
      )}
    </div>
  );
}
