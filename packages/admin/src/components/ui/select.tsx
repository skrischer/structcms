'use client';

import { Check, ChevronDown } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

function Select({
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  className,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex items-center justify-between w-full h-9 rounded-md py-2 px-3 text-[14px] leading-[18px] text-[#334155] bg-white border transition-colors focus-visible:outline-none',
          disabled && 'opacity-60 cursor-not-allowed bg-[#F8FAFC]',
          error
            ? 'border-[#EF4444] ring-[3px] ring-[rgba(239,68,68,0.15)]'
            : open
              ? 'border-[#3B82F6] ring-[3px] ring-[rgba(59,130,246,0.15)]'
              : 'border-[#E2E8F0] focus-visible:border-[#3B82F6] focus-visible:ring-[3px] focus-visible:ring-[rgba(59,130,246,0.15)]',
          open && 'rounded-b-none'
        )}
      >
        <span className={selectedOption ? 'text-[#1E293B]' : 'text-[#94A3B8]'}>
          {selectedOption ? selectedOption.label : (placeholder ?? 'Select...')}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            'shrink-0 transition-transform',
            error ? 'text-[#EF4444]' : open ? 'text-[#3B82F6] rotate-180' : 'text-[#94A3B8]'
          )}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        <div className="absolute z-10 w-full bg-white border-l border-r border-b border-[#E2E8F0] rounded-b-md shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                className={cn(
                  'flex items-center gap-2 w-full py-2 px-3 text-[14px] leading-[18px] text-left transition-colors hover:bg-[#F8FAFC]',
                  isSelected && 'bg-[#EFF6FF] text-[#2563EB] font-medium'
                )}
                onClick={() => {
                  onChange?.(option.value);
                  setOpen(false);
                }}
              >
                {isSelected && <Check size={14} strokeWidth={2} className="text-[#2563EB]" />}
                <span className={isSelected ? '' : 'text-[#1E293B]'}>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

Select.displayName = 'Select';

export { Select };
