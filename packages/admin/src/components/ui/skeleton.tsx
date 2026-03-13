import type * as React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
}

/**
 * Skeleton loading placeholder with pulse animation.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-48" />
 * <Skeleton width={200} height={20} />
 * ```
 */
function Skeleton({ className, width, height, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      style={{ width, height, ...style }}
      data-testid="skeleton"
      {...props}
    />
  );
}

Skeleton.displayName = 'Skeleton';

export { Skeleton };
