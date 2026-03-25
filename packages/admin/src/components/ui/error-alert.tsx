import { AlertCircle } from "lucide-react";
import type * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

export interface ErrorAlertProps {
  children: React.ReactNode;
  onRetry?: () => void;
  className?: string;
  "data-testid"?: string;
  variant?: "inline" | "card";
  title?: string;
}

function ErrorAlert({
  children,
  onRetry,
  className,
  "data-testid": testId,
  variant = "inline",
  title,
}: ErrorAlertProps) {
  if (variant === "card") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center text-center rounded-lg border border-[var(--admin-gray-200)] bg-[var(--admin-surface-card)] shadow-xs py-10 px-8",
          className,
        )}
        data-testid={testId}
        role="alert"
      >
        <div className="w-16 h-16 rounded-full bg-[var(--admin-error-50)] flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-[var(--admin-error-500)]" />
        </div>
        {title && (
          <p className="text-[16px] font-semibold text-[var(--admin-gray-900)]">
            {title}
          </p>
        )}
        <p className="text-[14px] text-[var(--admin-gray-500)] mt-1 max-w-sm">
          {children}
        </p>
        {onRetry && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={onRetry}
            data-testid={testId ? `${testId}-retry` : undefined}
          >
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (onRetry) {
    return (
      <div className={cn(className)} data-testid={testId} role="alert">
        {title && (
          <p className="text-sm font-semibold text-[var(--admin-error-700)]">
            {title}
          </p>
        )}
        <p className="text-sm text-[var(--admin-error-700)]">{children}</p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-2"
          onClick={onRetry}
          data-testid={testId ? `${testId}-retry` : undefined}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <p
      className={cn("text-sm text-[var(--admin-error-700)]", className)}
      role="alert"
      data-testid={testId}
    >
      {title && <span className="font-semibold">{title} </span>}
      {children}
    </p>
  );
}

ErrorAlert.displayName = "ErrorAlert";

export { ErrorAlert };
