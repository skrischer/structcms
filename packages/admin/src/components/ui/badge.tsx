import { type VariantProps, cva } from "class-variance-authority";
import { X } from "lucide-react";
import type * as React from "react";
import { cn } from "../../lib/utils";

const badgeVariants = cva("inline-flex items-center font-medium", {
  variants: {
    variant: {
      default: "bg-[var(--admin-gray-100)] text-[var(--admin-gray-600)]",
      primary: "bg-[var(--admin-primary-50)] text-[var(--admin-primary-600)]",
      success: "bg-[var(--admin-success-50)] text-[var(--admin-success-700)]",
      warning: "bg-[var(--admin-warning-50)] text-[var(--admin-warning-700)]",
      error: "bg-[var(--admin-error-50)] text-[var(--admin-error-700)]",
    },
    size: {
      default: "text-[12px] leading-4 py-0.5 px-2 rounded-[3px]",
      sm: "text-[12px] leading-4 py-0.5 px-2 rounded-[3px]",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const closeIconColors: Record<string, string> = {
  default: "text-[var(--admin-gray-400)]",
  primary: "text-[var(--admin-primary-300)]",
  success: "text-[var(--admin-success-300)]",
  warning: "text-[var(--admin-warning-300)]",
  error: "text-[var(--admin-error-300)]",
};

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  onClose?: () => void;
}

function Badge({
  className,
  variant,
  size,
  onClose,
  children,
  ...props
}: BadgeProps) {
  const variantKey = variant ?? "default";

  return (
    <span
      className={cn(
        badgeVariants({ variant, size }),
        onClose && "pr-1.5 gap-1",
        className,
      )}
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
          <X
            size={14}
            strokeWidth={2}
            className={closeIconColors[variantKey]}
          />
        </button>
      )}
    </span>
  );
}

Badge.displayName = "Badge";

export { Badge, badgeVariants };
