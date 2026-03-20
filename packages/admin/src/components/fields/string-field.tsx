import * as React from 'react';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export interface StringFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

const StringField = React.forwardRef<HTMLInputElement, StringFieldProps>(
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
          type="text"
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
StringField.displayName = 'StringField';

export { StringField };
