import * as React from 'react';
import { cn } from '../../lib/utils';
import { Label } from '../ui/label';

export interface SelectInputProps {
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

function SelectInput({
  label,
  options,
  value,
  onChange,
  error,
  required,
  name,
  id,
  className,
}: SelectInputProps) {
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
        <div
          role="radiogroup"
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className="flex flex-col gap-2"
        >
          {options.map((option) => {
            const optionId = `${inputId}-${option}`;
            return (
              <label key={option} className="flex items-center gap-2 text-sm" htmlFor={optionId}>
                <input
                  type="radio"
                  id={optionId}
                  name={name || inputId}
                  value={option}
                  checked={value === option}
                  onChange={() => onChange?.(option)}
                  data-testid={`select-option-${option}`}
                />
                {option}
              </label>
            );
          })}
        </div>
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
SelectInput.displayName = 'SelectInput';

export { SelectInput };
