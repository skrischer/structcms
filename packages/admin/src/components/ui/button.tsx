import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#2563EB] text-white hover:bg-[#1D4ED8] active:bg-[#1E40AF] focus-visible:ring-[3px] focus-visible:ring-[rgba(59,130,246,0.15)]",
        secondary:
          "bg-white text-[#334155] border border-[#E2E8F0] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] active:border-[#CBD5E1] focus-visible:ring-[3px] focus-visible:ring-[rgba(59,130,246,0.15)]",
        ghost:
          "text-[#475569] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] focus-visible:ring-[3px] focus-visible:ring-[rgba(59,130,246,0.15)]",
        destructive:
          "bg-[#EF4444] text-white hover:bg-[#DC2626] active:bg-[#B91C1C] focus-visible:ring-[3px] focus-visible:ring-[rgba(239,68,68,0.15)]",
        "destructive-outline":
          "text-[#EF4444] border border-[#EF4444] hover:bg-[#FEF2F2] active:bg-[#FEE2E2] active:border-[#DC2626] active:text-[#B91C1C] focus-visible:ring-[3px] focus-visible:ring-[rgba(239,68,68,0.15)]",
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
