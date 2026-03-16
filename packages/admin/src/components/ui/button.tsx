import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--admin-primary-600)] text-white hover:bg-[var(--admin-primary-700)] active:bg-[var(--admin-primary-800)] focus-visible:ring-[3px] focus-visible:ring-[var(--admin-shadow-ring)]",
        secondary:
          "bg-[var(--admin-surface-card)] text-[var(--admin-gray-700)] border border-[var(--admin-gray-200)] hover:bg-[var(--admin-gray-100)] active:bg-[var(--admin-gray-200)] active:border-[var(--admin-gray-300)] focus-visible:ring-[3px] focus-visible:ring-[var(--admin-shadow-ring)]",
        ghost:
          "text-[var(--admin-gray-600)] hover:bg-[var(--admin-gray-100)] active:bg-[var(--admin-gray-200)] focus-visible:ring-[3px] focus-visible:ring-[var(--admin-shadow-ring)]",
        destructive:
          "bg-[var(--admin-error-500)] text-white hover:bg-[var(--admin-error-600)] active:bg-[var(--admin-error-700)] focus-visible:ring-[3px] focus-visible:ring-[var(--admin-shadow-ring-error)]",
        "destructive-outline":
          "text-[var(--admin-error-500)] border border-[var(--admin-error-500)] hover:bg-[var(--admin-error-50)] active:bg-[var(--admin-error-100)] active:border-[var(--admin-error-600)] active:text-[var(--admin-error-700)] focus-visible:ring-[3px] focus-visible:ring-[var(--admin-shadow-ring-error)]",
      },
      size: {
        default: "h-9 px-4 py-2 text-[14px]",
        sm: "h-8 px-3 py-1.5 text-[13px]",
        lg: "h-10 px-5 py-2.5 text-[14px]",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
