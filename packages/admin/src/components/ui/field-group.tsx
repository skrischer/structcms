import type * as React from "react";
import { cn } from "../../lib/utils";

export interface FieldGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  children: React.ReactNode;
}

function FieldGroup({ label, children, className, ...props }: FieldGroupProps) {
  return (
    <div className={cn(className)} data-testid="field-group" {...props}>
      {label && (
        <div className="text-[11px] tracking-[0.06em] uppercase font-semibold text-[var(--admin-gray-500)]">
          {label}
        </div>
      )}
      <div className={cn("flex flex-col gap-4", label && "mt-4")}>
        {children}
      </div>
    </div>
  );
}

FieldGroup.displayName = "FieldGroup";

export { FieldGroup };
