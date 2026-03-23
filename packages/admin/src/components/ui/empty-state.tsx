import type * as React from "react";
import { cn } from "../../lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "inline" | "card";
}

function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  variant = "inline",
  ...props
}: EmptyStateProps) {
  const isCard = variant === "card";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        isCard
          ? "rounded-lg border border-[var(--admin-gray-200)] bg-[var(--admin-surface-card)] shadow-xs py-12 px-8"
          : "py-12 px-6",
        className,
      )}
      data-testid="empty-state"
      {...props}
    >
      {icon && (
        <div
          className={cn(
            isCard
              ? "w-16 h-16 rounded-full bg-[var(--admin-gray-100)] flex items-center justify-center mb-4 text-[var(--admin-gray-400)]"
              : "text-[var(--admin-gray-400)] mb-3",
          )}
        >
          {icon}
        </div>
      )}
      <p
        className={cn(
          "text-[16px]",
          isCard
            ? "font-semibold text-[var(--admin-gray-900)]"
            : "font-medium text-[var(--admin-gray-800)]",
        )}
      >
        {title}
      </p>
      {description && (
        <p className="text-[14px] text-[var(--admin-gray-500)] mt-1 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

EmptyState.displayName = "EmptyState";

export { EmptyState };
