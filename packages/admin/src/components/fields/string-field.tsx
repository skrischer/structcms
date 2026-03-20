import * as React from 'react';
import { cn } from '../../lib/utils';
import { FieldMessage } from '../ui/field-message';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export interface StringFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  description?: string;
}

const StringField = React.forwardRef<HTMLInputElement, StringFieldProps>(
  ({ className, label, error, description, required, id, ...props }, ref) => {
    const inputId = id || props.name || React.useId();
    const messageId = error ? `${inputId}-error` : description ? `${inputId}-desc` : undefined;

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
        <Input
          id={inputId}
          ref={ref}
          type="text"
          aria-invalid={!!error}
          aria-describedby={messageId}
          className={cn(error && 'border-[var(--admin-error-500)]')}
          {...props}
        />
        {description && !error && <FieldMessage id={`${inputId}-desc`}>{description}</FieldMessage>}
        {error && (
          <FieldMessage id={`${inputId}-error`} variant="error">
            {error}
          </FieldMessage>
        )}
      </div>
    );
  }
);
StringField.displayName = 'StringField';

export { StringField };
