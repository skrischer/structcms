import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  error?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

// Note: prefix/suffix should be treated as static props. Toggling them dynamically
// between renders changes the root element type (input vs div wrapper), which causes
// React to unmount/remount and lose focus state.
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, prefix, suffix, ...props }, ref) => {
    const hasSlots = prefix !== undefined || suffix !== undefined;

    if (!hasSlots) {
      return (
        <input
          type={type}
          className={cn(
            'flex h-9 w-full rounded-md border bg-[var(--admin-surface-card)] px-3 py-2 text-[14px] leading-[18px] text-[var(--admin-gray-800)] placeholder:text-[var(--admin-gray-400)] transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-[var(--admin-gray-50)]',
            error
              ? 'border-[var(--admin-error-500)] ring-[3px] ring-[var(--admin-shadow-ring-error)] focus-visible:border-[var(--admin-error-500)] focus-visible:ring-[var(--admin-shadow-ring-error)]'
              : 'border-[var(--admin-gray-200)] focus-visible:border-[var(--admin-primary-500)] focus-visible:ring-[3px] focus-visible:ring-[var(--admin-shadow-ring)]',
            className
          )}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <div
        className={cn(
          'flex items-center h-9 w-full rounded-md border bg-[var(--admin-surface-card)] transition-colors',
          error
            ? 'border-[var(--admin-error-500)] ring-[3px] ring-[var(--admin-shadow-ring-error)] focus-within:border-[var(--admin-error-500)] focus-within:ring-[var(--admin-shadow-ring-error)]'
            : 'border-[var(--admin-gray-200)] focus-within:border-[var(--admin-primary-500)] focus-within:ring-[3px] focus-within:ring-[var(--admin-shadow-ring)]',
          props.disabled && 'opacity-60 cursor-not-allowed bg-[var(--admin-gray-50)]',
          className
        )}
      >
        {prefix && (
          <span className="flex items-center text-[var(--admin-gray-400)] text-[13px] pl-3 shrink-0">
            {prefix}
          </span>
        )}
        <input
          type={type}
          className={cn(
            'border-none outline-none ring-0 bg-transparent flex-1 h-full text-[14px] leading-[18px] text-[var(--admin-gray-800)] placeholder:text-[var(--admin-gray-400)] disabled:cursor-not-allowed disabled:opacity-60',
            prefix ? 'pl-2' : 'pl-3',
            suffix ? 'pr-2' : 'pr-3'
          )}
          ref={ref}
          {...props}
        />
        {suffix && (
          <span className="flex items-center text-[var(--admin-gray-400)] text-[13px] pr-3 shrink-0">
            {suffix}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
