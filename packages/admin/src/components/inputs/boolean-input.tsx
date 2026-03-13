import * as React from 'react';
import { cn } from '../../lib/utils';
import { Label } from '../ui/label';

export interface BooleanInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked'> {
  label: string;
  error?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const BooleanInput = React.forwardRef<HTMLInputElement, BooleanInputProps>(
  (
    { className, label, error, required, id, checked, onCheckedChange, onChange, ...props },
    ref
  ) => {
    const inputId = id || props.name || React.useId();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <div className={cn('space-y-2', className)} data-testid="boolean-input">
        <div className="flex items-center gap-2">
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(error && 'border-destructive')}
            {...props}
          />
          <Label htmlFor={inputId}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }
);
BooleanInput.displayName = 'BooleanInput';

export { BooleanInput };
