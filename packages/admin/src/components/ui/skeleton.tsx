import type * as React from "react";
import { cn } from "../../lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  shape?: "text" | "circle" | "rect" | "button";
}

const shapeClasses: Record<string, string> = {
  text: "rounded-sm",
  circle: "rounded-full",
  rect: "rounded-lg",
  button: "rounded-md",
};

function Skeleton({
  className,
  width,
  height,
  shape = "text",
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-[var(--admin-gray-200)]",
        shapeClasses[shape],
        className,
      )}
      style={{ width, height, ...style }}
      data-testid="skeleton"
      {...props}
    />
  );
}

Skeleton.displayName = "Skeleton";

export { Skeleton };
