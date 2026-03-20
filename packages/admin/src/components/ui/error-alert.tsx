import type * as React from 'react';
import { cn } from '../../lib/utils';
import { Button } from './button';

export interface ErrorAlertProps {
  children: React.ReactNode;
  onRetry?: () => void;
  className?: string;
  'data-testid'?: string;
}

function ErrorAlert({ children, onRetry, className, 'data-testid': testId }: ErrorAlertProps) {
  if (onRetry) {
    return (
      <div className={cn(className)} data-testid={testId}>
        <p className="text-sm text-[var(--admin-error-700)]" role="alert">
          {children}
        </p>
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
      className={cn('text-sm text-[var(--admin-error-700)]', className)}
      role="alert"
      data-testid={testId}
    >
      {children}
    </p>
  );
}

ErrorAlert.displayName = 'ErrorAlert';

export { ErrorAlert };
