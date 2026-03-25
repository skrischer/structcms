'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: readonly { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  error?: boolean;
  orientation?: 'vertical' | 'horizontal';
  testIdPrefix?: string;
}

function RadioGroup({
  options,
  value,
  onChange,
  name,
  disabled,
  error,
  orientation = 'vertical',
  className,
  testIdPrefix = 'radio',
  ...rest
}: RadioGroupProps) {
  const generatedName = React.useId();
  const groupName = name || generatedName;

  return (
    <div
      role="radiogroup"
      {...rest}
      className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-col gap-2' : 'flex-row gap-4',
        className
      )}
      data-testid="radio-group"
    >
      {options.map((option) => {
        const isChecked = value === option.value;
        const optionId = `${groupName}-${option.value}`;

        return (
          <label
            key={option.value}
            htmlFor={optionId}
            className={cn(
              'inline-flex items-center gap-2 cursor-pointer',
              disabled && 'opacity-60 cursor-not-allowed'
            )}
          >
            <div className="relative flex items-center justify-center w-[18px] h-[18px] shrink-0">
              <input
                type="radio"
                id={optionId}
                name={groupName}
                value={option.value}
                checked={isChecked}
                onChange={() => onChange?.(option.value)}
                disabled={disabled}
                className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                data-testid={`${testIdPrefix}-option-${option.value}`}
              />
              <div
                className={cn(
                  'w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 pointer-events-none transition-colors',
                  'peer-focus-visible:ring-[3px] peer-focus-visible:ring-[var(--admin-shadow-ring)]',
                  error
                    ? 'border-[var(--admin-error-500)]'
                    : isChecked
                      ? 'border-[var(--admin-primary-600)]'
                      : 'border-[var(--admin-gray-300)]'
                )}
                aria-hidden="true"
              >
                {isChecked && (
                  <div className="w-[10px] h-[10px] rounded-full bg-[var(--admin-primary-600)]" />
                )}
              </div>
            </div>
            <span className="text-[14px] text-[var(--admin-gray-800)]">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}

RadioGroup.displayName = 'RadioGroup';

export { RadioGroup };
