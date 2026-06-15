import type * as React from 'react';
import { cn } from '../../lib/utils';

export interface FieldMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'default' | 'error';
  children: React.ReactNode;
}

function FieldMessage({ variant = 'default', children, className, ...props }: FieldMessageProps) {
  return (
    <p
      className={cn(
        'text-[12px] leading-4',
        variant === 'error' ? 'text-[var(--admin-error-700)]' : 'text-[var(--admin-gray-500)]',
        className
      )}
      role={variant === 'error' ? 'alert' : undefined}
      data-testid="field-message"
      {...props}
    >
      {children}
    </p>
  );
}

FieldMessage.displayName = 'FieldMessage';

export { FieldMessage };
