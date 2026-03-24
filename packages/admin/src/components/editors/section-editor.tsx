"use client";
import type { z } from "zod";
import { useAdmin } from "../../hooks/use-admin";
import { cn } from "../../lib/utils";
import { FormGenerator } from "../forms/form-generator";

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
  submitLabel = "Save Section",
  className,
}: SectionEditorProps) {
  const { registry } = useAdmin();

  const section = registry.getSection(sectionType);

  if (!section) {
    return (
      <div
        className={cn(
          "rounded-md border border-[var(--admin-error-500)] p-4",
          className,
        )}
        data-testid="section-editor-error"
      >
        <p className="text-sm text-[var(--admin-error-600)]">
          Unknown section type: <strong>{sectionType}</strong>
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)} data-testid="section-editor">
      <h3 className="text-lg font-semibold capitalize">
        {section.name} Section
      </h3>
      <FormGenerator
        schema={section.schema as z.ZodObject<z.ZodRawShape>}
        onSubmit={onChange}
        onChange={onChange}
        defaultValues={data}
        submitLabel={submitLabel}
        descriptions={section.descriptions}
        groups={section.groups}
      />
    </div>
  );
}

SectionEditor.displayName = "SectionEditor";

export { SectionEditor };
