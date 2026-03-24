import * as React from "react";
import { cn } from "../../lib/utils";

export interface ActionFooterProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

function ActionFooter({ left, right, className }: ActionFooterProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 flex items-center justify-between bg-white border-t border-[var(--admin-border-default)] shadow-sm px-6 py-3",
        className,
      )}
      data-testid="action-footer"
    >
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}

ActionFooter.displayName = "ActionFooter";

export { ActionFooter };
