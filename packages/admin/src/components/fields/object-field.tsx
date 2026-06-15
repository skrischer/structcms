import * as React from 'react';
import { cn } from '../../lib/utils';
import { FieldMessage } from '../ui/field-message';

export interface ObjectFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  description?: string;
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
  description,
  required,
  className,
  id,
  name,
}: ObjectFieldProps) {
  const fieldId = id || name || React.useId();
  const messageId = error ? `${fieldId}-error` : description ? `${fieldId}-desc` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div
        id={`${fieldId}-label`}
        className="text-[11px] tracking-[0.06em] uppercase font-semibold text-[var(--admin-gray-500)]"
      >
        {label}
        {required && <span className="text-[var(--admin-error-500)] ml-0.5">*</span>}
      </div>
      <div
        id={fieldId}
        className={cn(
          'border-l-2 border-[var(--admin-gray-200)] pl-4 flex flex-col gap-3',
          error && 'border-[var(--admin-error-500)]'
        )}
        // biome-ignore lint/a11y/useSemanticElements: Using div with role="group" for consistent styling with other inputs
        role="group"
        aria-labelledby={`${fieldId}-label`}
        aria-describedby={messageId}
        data-testid="object-field-container"
      >
        {children}
      </div>
      {description && !error && <FieldMessage id={`${fieldId}-desc`}>{description}</FieldMessage>}
      {error && (
        <FieldMessage id={`${fieldId}-error`} variant="error">
          {error}
        </FieldMessage>
      )}
    </div>
  );
}

ObjectField.displayName = 'ObjectField';

export { ObjectField };
