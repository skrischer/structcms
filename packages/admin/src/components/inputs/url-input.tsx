import * as React from 'react';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export interface UrlInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

/**
 * URL input component for url fields with label, placeholder, and validation error display.
 */
const UrlInput = React.forwardRef<HTMLInputElement, UrlInputProps>(
  ({ className, label, error, required, id, ...props }, ref) => {
    const inputId = id || props.name || React.useId();

    return (
      <div className={cn('space-y-2', className)}>
        <Label htmlFor={inputId}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <Input
          id={inputId}
          ref={ref}
          type="url"
          placeholder="https://..."
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(error && 'border-destructive')}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }
);
UrlInput.displayName = 'UrlInput';

export { UrlInput };
