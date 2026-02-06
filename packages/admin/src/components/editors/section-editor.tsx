'use client';

import * as React from 'react';
import { type z } from 'zod';
import { useAdmin } from '../../hooks/use-admin';
import { FormGenerator } from '../../lib/form-generator';
import { cn } from '../../lib/utils';

export interface SectionEditorProps {
  sectionType: string;
  data?: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  submitLabel?: string;
  className?: string;
}

/**
 * Component that renders a form for a section based on its schema from the registry.
 *
 * @example
 * ```tsx
 * <AdminProvider registry={registry} apiBaseUrl="/api/cms">
 *   <SectionEditor
 *     sectionType="hero"
 *     data={{ title: 'Hello', subtitle: 'World' }}
 *     onChange={(data) => console.log(data)}
 *   />
 * </AdminProvider>
 * ```
 */
function SectionEditor({
  sectionType,
  data,
  onChange,
  submitLabel = 'Save Section',
  className,
}: SectionEditorProps) {
  const { registry } = useAdmin();

  const section = registry.getSection(sectionType);

  if (!section) {
    return (
      <div
        className={cn('rounded-md border border-destructive p-4', className)}
        data-testid="section-editor-error"
      >
        <p className="text-sm text-destructive">
          Unknown section type: <strong>{sectionType}</strong>
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)} data-testid="section-editor">
      <h3 className="text-lg font-semibold capitalize">{section.name}</h3>
      <FormGenerator
        schema={section.schema as z.ZodObject<z.ZodRawShape>}
        onSubmit={onChange}
        defaultValues={data}
        submitLabel={submitLabel}
      />
    </div>
  );
}

SectionEditor.displayName = 'SectionEditor';

export { SectionEditor };
