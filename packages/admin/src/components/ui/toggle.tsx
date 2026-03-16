'use client';

import { cn } from '../../lib/utils';

export interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

function Toggle({ checked, onChange, label, disabled, className }: ToggleProps) {
  const isChecked = checked ?? false;

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: Button with role="switch" inside label provides control association
    <label
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer',
        disabled && 'cursor-not-allowed',
        className
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={() => onChange?.(!isChecked)}
        className={cn(
          'relative flex items-center w-10 h-[22px] rounded-full p-0.5 shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(59,130,246,0.15)]',
          isChecked ? 'bg-[#2563EB] justify-end' : 'bg-[#CBD5E1]',
          disabled && 'opacity-50'
        )}
      >
        <div className="w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] shrink-0" />
      </button>
      {label && (
        <span
          className={cn(
            'text-[14px] leading-[18px]',
            disabled ? 'text-[#94A3B8]' : 'text-[#1E293B]'
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
}

Toggle.displayName = 'Toggle';

export { Toggle };
