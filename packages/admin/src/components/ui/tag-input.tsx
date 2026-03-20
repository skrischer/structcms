"use client";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Badge } from "./badge";

export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

function TagInput({
  value,
  onChange,
  placeholder,
  error,
  disabled,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  function addTag(raw: string) {
    const tag = raw.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
      setInputValue("");
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      const last = value[value.length - 1];
      if (last !== undefined) removeTag(last);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (val.includes(",")) {
      const parts = val.split(",");
      for (const part of parts) {
        addTag(part);
      }
      setInputValue("");
    } else {
      setInputValue(val);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 min-h-9 w-full rounded-md border bg-[var(--admin-surface-card)] px-2 py-1.5 transition-colors focus-within:outline-none",
        error
          ? "border-[var(--admin-error-500)] ring-[3px] ring-[var(--admin-shadow-ring-error)]"
          : "border-[var(--admin-gray-200)] focus-within:border-[var(--admin-primary-500)] focus-within:ring-[3px] focus-within:ring-[var(--admin-shadow-ring)]",
        disabled && "cursor-not-allowed opacity-60 bg-[var(--admin-gray-50)]",
        className,
      )}
      data-testid="tag-input"
      role="group"
      onClick={() => !disabled && inputRef.current?.focus()}
      onKeyDown={(e) => {
        if (
          (e.key === "Enter" || e.key === " ") &&
          e.target === e.currentTarget
        ) {
          e.preventDefault();
          if (!disabled) inputRef.current?.focus();
        }
      }}
    >
      {value.map((tag) => (
        <Badge
          key={tag}
          variant="default"
          size="sm"
          onClose={disabled ? undefined : () => removeTag(tag)}
        >
          {tag}
        </Badge>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : undefined}
        disabled={disabled}
        className="border-none outline-none bg-transparent text-[14px] text-[var(--admin-gray-800)] placeholder:text-[var(--admin-gray-400)] flex-1 min-w-[80px] h-6"
      />
    </div>
  );
}

TagInput.displayName = "TagInput";

export { TagInput };
