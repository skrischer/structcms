import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, showCount, onChange, ...props }, ref) => {
    const [length, setLength] = React.useState(() => {
      if (typeof props.value === 'string') return props.value.length;
      if (typeof props.defaultValue === 'string') return props.defaultValue.length;
      return 0;
    });

    // Sync length when controlled value changes
    React.useEffect(() => {
      if (typeof props.value === 'string') {
        setLength(props.value.length);
      }
    }, [props.value]);

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLength(e.target.value.length);
        onChange?.(e);
      },
      [onChange]
    );

    const textarea = (
      <textarea
        className={cn(
          'flex min-h-[96px] w-full rounded-md border bg-[var(--admin-surface-card)] px-3 py-2 text-[14px] leading-[18px] text-[var(--admin-gray-800)] placeholder:text-[var(--admin-gray-400)] transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-[var(--admin-gray-50)]',
          error
            ? 'border-[var(--admin-error-500)] ring-[3px] ring-[var(--admin-shadow-ring-error)] focus-visible:border-[var(--admin-error-500)] focus-visible:ring-[var(--admin-shadow-ring-error)]'
            : 'border-[var(--admin-gray-200)] focus-visible:border-[var(--admin-primary-500)] focus-visible:ring-[3px] focus-visible:ring-[var(--admin-shadow-ring)]',
          className
        )}
        ref={ref}
        onChange={showCount ? handleChange : onChange}
        {...props}
      />
    );

    if (!showCount) {
      return textarea;
    }

    const counterText =
      props.maxLength !== undefined
        ? `${length} / ${props.maxLength} characters`
        : `${length} characters`;

    return (
      <div className="w-full">
        {textarea}
        <div className="flex justify-end mt-1">
          <span className="text-[12px] text-[var(--admin-gray-400)]" data-testid="textarea-counter">
            {counterText}
          </span>
        </div>
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
