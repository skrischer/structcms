import * as React from 'react';
import { cn } from '../../lib/utils';
import { FieldMessage } from '../ui/field-message';
import { Label } from '../ui/label';
import { RadioGroup } from '../ui/radio-group';

export interface SelectFieldProps {
  label: string;
  options: readonly string[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  description?: string;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

function SelectField({
  label,
  options,
  value,
  onChange,
  error,
  description,
  required,
  name,
  id,
  className,
}: SelectFieldProps) {
  const generatedId = React.useId();
  const inputId = id || name || generatedId;
  const isRadio = options.length <= 3;
  const messageId = error ? `${inputId}-error` : description ? `${inputId}-desc` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)} data-testid="select-input">
      <Label htmlFor={isRadio ? undefined : inputId} required={required}>
        {label}
      </Label>
      {isRadio ? (
        <RadioGroup
          options={options.map((o) => ({ value: o, label: o }))}
          value={value}
          onChange={onChange}
          name={name || inputId}
          error={!!error}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={messageId}
          testIdPrefix="select"
        />
      ) : (
        <select
          id={inputId}
          name={name}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={messageId}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            error && 'border-[var(--admin-error-500)]'
          )}
          data-testid="select-dropdown"
        >
          <option value="" disabled>
            Select...
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      {description && !error && <FieldMessage id={`${inputId}-desc`}>{description}</FieldMessage>}
      {error && (
        <FieldMessage id={`${inputId}-error`} variant="error">
          {error}
        </FieldMessage>
      )}
    </div>
  );
}
SelectField.displayName = 'SelectField';

export { SelectField };
