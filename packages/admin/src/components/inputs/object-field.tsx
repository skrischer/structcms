import * as React from 'react';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';

export interface ObjectFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

/**
 * Component for nested object fields, rendering sub-form with visual grouping.
 *
 * @example
 * ```tsx
 * <ObjectField label="Address" required>
 *   <StringInput label="Street" {...register('address.street')} />
 *   <StringInput label="City" {...register('address.city')} />
 *   <StringInput label="Zip" {...register('address.zip')} />
 * </ObjectField>
 * ```
 */
function ObjectField({
  label,
  children,
  error,
  required,
  className,
  id,
  name,
}: ObjectFieldProps) {
  const fieldId = id || name || React.useId();

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={fieldId}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div
        id={fieldId}
        className={cn(
          'rounded-md border border-input bg-muted/30 p-4 space-y-4',
          error && 'border-destructive'
        )}
        role="group"
        aria-labelledby={`${fieldId}-label`}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        data-testid="object-field-container"
      >
        {children}
      </div>
      {error && (
        <p id={`${fieldId}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

ObjectField.displayName = 'ObjectField';

export { ObjectField };
