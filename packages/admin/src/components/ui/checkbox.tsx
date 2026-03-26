"use client";

import { cn } from "../../lib/utils";

export interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

function Checkbox({
  checked,
  indeterminate,
  onChange,
  label,
  disabled,
  className,
}: CheckboxProps) {
  const isChecked = checked ?? false;
  const showCheck = isChecked || indeterminate;

  return (
    <label
      className={cn(
        "relative inline-flex items-center gap-2 cursor-pointer",
        disabled && "cursor-not-allowed",
        className,
      )}
    >
      <button
        type="button"
        // biome-ignore lint/a11y/useSemanticElements: Custom styled checkbox requires button with role for visual design
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : isChecked}
        disabled={disabled}
        onClick={() => onChange?.(!isChecked)}
        className={cn(
          "flex items-center justify-center w-[18px] h-[18px] rounded-[3px] shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--admin-shadow-ring)]",
          showCheck
            ? "bg-[var(--admin-primary-600)]"
            : "bg-[var(--admin-surface-card)] border-2 border-[var(--admin-gray-300)]",
          disabled && "opacity-50",
        )}
      >
        {isChecked && !indeterminate && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <title>Checked</title>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {indeterminate && (
          <div className="w-2.5 h-0.5 rounded-[1px] bg-white" />
        )}
      </button>
      {label && (
        <span
          className={cn(
            "text-[14px] leading-[18px]",
            disabled
              ? "text-[var(--admin-gray-400)]"
              : "text-[var(--admin-gray-800)]",
          )}
        >
          {label}
        </span>
      )}
      <input
        type="checkbox"
        className="sr-only"
        checked={isChecked}
        disabled={disabled}
        readOnly
      />
    </label>
  );
}

Checkbox.displayName = "Checkbox";

export { Checkbox };
