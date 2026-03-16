"use client";

import { Check, ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

function Select({
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  className,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex items-center justify-between w-full h-9 rounded-md py-2 px-3 text-[14px] leading-[18px] text-[var(--admin-gray-700)] bg-[var(--admin-surface-card)] border transition-colors focus-visible:outline-none",
          disabled && "opacity-60 cursor-not-allowed bg-[var(--admin-gray-50)]",
          error
            ? "border-[var(--admin-error-500)] ring-[3px] ring-[var(--admin-shadow-ring-error)]"
            : open
              ? "border-[var(--admin-primary-500)] ring-[3px] ring-[var(--admin-shadow-ring)]"
              : "border-[var(--admin-gray-200)] focus-visible:border-[var(--admin-primary-500)] focus-visible:ring-[3px] focus-visible:ring-[var(--admin-shadow-ring)]",
          open && "rounded-b-none",
        )}
      >
        <span
          className={
            selectedOption
              ? "text-[var(--admin-gray-800)]"
              : "text-[var(--admin-gray-400)]"
          }
        >
          {selectedOption ? selectedOption.label : (placeholder ?? "Select...")}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 transition-transform",
            error
              ? "text-[var(--admin-error-500)]"
              : open
                ? "text-[var(--admin-primary-500)] rotate-180"
                : "text-[var(--admin-gray-400)]",
          )}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        <div className="absolute z-10 w-full bg-[var(--admin-surface-card)] border-l border-r border-b border-[var(--admin-gray-200)] rounded-b-md shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "flex items-center gap-2 w-full py-2 px-3 text-[14px] leading-[18px] text-left transition-colors hover:bg-[var(--admin-gray-50)]",
                  isSelected &&
                    "bg-[var(--admin-primary-50)] text-[var(--admin-primary-600)] font-medium",
                )}
                onClick={() => {
                  onChange?.(option.value);
                  setOpen(false);
                }}
              >
                {isSelected && (
                  <Check
                    size={14}
                    strokeWidth={2}
                    className="text-[var(--admin-primary-600)]"
                  />
                )}
                <span
                  className={isSelected ? "" : "text-[var(--admin-gray-800)]"}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

Select.displayName = "Select";

export { Select };
