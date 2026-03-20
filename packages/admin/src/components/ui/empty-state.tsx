import type * as React from 'react';
import { cn } from '../../lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

function EmptyState({ className, icon, title, description, action, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center text-center py-12 px-6', className)}
      data-testid="empty-state"
      {...props}
    >
      {icon && <div className="text-[var(--admin-gray-400)] mb-3">{icon}</div>}
      <p className="text-[16px] font-medium text-[var(--admin-gray-800)]">{title}</p>
      {description && (
        <p className="text-[14px] text-[var(--admin-gray-500)] mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

EmptyState.displayName = 'EmptyState';

export { EmptyState };
