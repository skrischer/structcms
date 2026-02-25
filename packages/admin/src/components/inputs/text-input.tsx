import * as React from 'react';
import { cn } from '../../lib/utils';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

export interface TextInputProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'> {
  label: string;
  error?: string;
  rows?: number;
}

/**
 * Textarea component for long text fields with label, placeholder, and validation error display.
 *
 * @example
 * ```tsx
 * <TextInput
 *   label="Description"
 *   placeholder="Enter description..."
 *   rows={5}
 *   required
 *   {...register('description')}
 *   error={errors.description?.message}
 * />
 * ```
 */
const TextInput = React.forwardRef<HTMLTextAreaElement, TextInputProps>(
  ({ className, label, error, required, id, rows = 3, ...props }, ref) => {
    const inputId = id || props.name || React.useId();

    return (
      <div className={cn('space-y-2', className)}>
        <Label htmlFor={inputId}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <Textarea
          id={inputId}
          ref={ref}
          rows={rows}
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
TextInput.displayName = 'TextInput';

export { TextInput };
