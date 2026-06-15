import * as React from 'react';
import { cn } from '../../lib/utils';
import { FieldMessage } from '../ui/field-message';
import { Toggle } from '../ui/toggle';

export interface BooleanFieldProps {
  label: string;
  error?: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
}

function BooleanField({
  className,
  label,
  error,
  description,
  required,
  id,
  name,
  checked,
  onCheckedChange,
  disabled,
}: BooleanFieldProps) {
  const inputId = id || name || React.useId();
  const messageId = error ? `${inputId}-error` : description ? `${inputId}-desc` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)} data-testid="boolean-input">
      <div className="inline-flex items-center gap-2">
        <Toggle
          checked={checked}
          onChange={onCheckedChange}
          label={label}
          disabled={disabled}
          aria-describedby={messageId}
        />
        {required && <span className="text-[var(--admin-error-500)] text-[13px]">*</span>}
      </div>
      {description && !error && <FieldMessage id={`${inputId}-desc`}>{description}</FieldMessage>}
      {error && (
        <FieldMessage id={`${inputId}-error`} variant="error">
          {error}
        </FieldMessage>
      )}
    </div>
  );
}

BooleanField.displayName = 'BooleanField';

export { BooleanField };
