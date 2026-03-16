import * as React from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[96px] w-full rounded-md border bg-[var(--admin-surface-card)] px-3 py-2 text-[14px] leading-[18px] text-[var(--admin-gray-800)] placeholder:text-[var(--admin-gray-400)] transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-[var(--admin-gray-50)]",
          error
            ? "border-[var(--admin-error-500)] ring-[3px] ring-[var(--admin-shadow-ring-error)] focus-visible:border-[var(--admin-error-500)] focus-visible:ring-[var(--admin-shadow-ring-error)]"
            : "border-[var(--admin-gray-200)] focus-visible:border-[var(--admin-primary-500)] focus-visible:ring-[3px] focus-visible:ring-[var(--admin-shadow-ring)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
