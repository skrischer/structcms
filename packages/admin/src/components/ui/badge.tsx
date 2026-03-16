import { type VariantProps, cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import type * as React from 'react';
import { cn } from '../../lib/utils';

const badgeVariants = cva('inline-flex items-center font-medium', {
  variants: {
    variant: {
      default: 'bg-[#F1F5F9] text-[#475569]',
      primary: 'bg-[#EFF6FF] text-[#2563EB]',
      success: 'bg-[#F0FDF4] text-[#15803D]',
      warning: 'bg-[#FFFBEB] text-[#B45309]',
      error: 'bg-[#FEF2F2] text-[#B91C1C]',
    },
    size: {
      default: 'text-[12px] leading-4 py-0.5 px-2 rounded-sm',
      sm: 'text-[11px] leading-[14px] py-px px-1.5 rounded-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const closeIconColors: Record<string, string> = {
  default: 'text-[#94A3B8]',
  primary: 'text-[#93C5FD]',
  success: 'text-[#86EFAC]',
  warning: 'text-[#FCD34D]',
  error: 'text-[#FCA5A5]',
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  onClose?: () => void;
}

function Badge({ className, variant, size, onClose, children, ...props }: BadgeProps) {
  const variantKey = variant ?? 'default';

  return (
    <span
      className={cn(badgeVariants({ variant, size }), onClose && 'pr-1.5 gap-1', className)}
      {...props}
    >
      {children}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="inline-flex shrink-0"
          aria-label="Remove"
        >
          <X size={14} strokeWidth={2} className={closeIconColors[variantKey]} />
        </button>
      )}
    </span>
  );
}

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
