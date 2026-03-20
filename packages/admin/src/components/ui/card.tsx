import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const cardVariants = cva(
  "bg-[var(--admin-surface-card)] rounded-lg border border-[var(--admin-gray-200)]",
  {
    variants: {
      variant: {
        default: "shadow-[var(--admin-shadow-xs)]",
        outlined: "",
        elevated: "shadow-[var(--admin-shadow-md)]",
      },
      padding: {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  },
);

export interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, className }))}
        data-testid="card"
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

export { Card, cardVariants };
