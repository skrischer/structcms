import * as React from 'react';
import { cn } from '../../lib/utils';
import { Label } from '../ui/label';
import { RadioGroup } from '../ui/radio-group';

export interface SelectFieldProps {
  label: string;
  options: readonly string[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
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
  required,
  name,
  id,
  className,
}: SelectFieldProps) {
  const generatedId = React.useId();
  const inputId = id || name || generatedId;
  const isRadio = options.length <= 3;

  return (
    <div className={cn('space-y-2', className)} data-testid="select-input">
      <Label htmlFor={isRadio ? undefined : inputId}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
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
          aria-describedby={error ? `${inputId}-error` : undefined}
          testIdPrefix="select"
        />
      ) : (
        <select
          id={inputId}
          name={name}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            error && 'border-destructive'
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
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
SelectField.displayName = 'SelectField';

export { SelectField };
