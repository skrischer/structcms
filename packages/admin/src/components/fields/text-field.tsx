import * as React from 'react';
import { cn } from '../../lib/utils';
import { FieldMessage } from '../ui/field-message';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

export interface TextFieldProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'> {
  label: string;
  error?: string;
  description?: string;
  rows?: number;
}

const TextField = React.forwardRef<HTMLTextAreaElement, TextFieldProps>(
  ({ className, label, error, description, required, id, rows = 3, ...props }, ref) => {
    const inputId = id || props.name || React.useId();
    const messageId = error ? `${inputId}-error` : description ? `${inputId}-desc` : undefined;

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
        <Textarea
          id={inputId}
          ref={ref}
          rows={rows}
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
TextField.displayName = 'TextField';

export { TextField };
