'use client';

import * as React from 'react';
import { type SectionData } from '@structcms/core';
import { useAdmin } from '../../hooks/use-admin';
import { SectionEditor } from './section-editor';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export interface PageEditorProps {
  sections: SectionData[];
  allowedSections: string[];
  onSave: (sections: SectionData[]) => void;
  className?: string;
}

/**
 * Full page editor with multiple sections, add/remove/reorder sections.
 *
 * @example
 * ```tsx
 * <AdminProvider registry={registry} apiBaseUrl="/api/cms">
 *   <PageEditor
 *     sections={page.sections}
 *     allowedSections={['hero', 'content', 'cta']}
 *     onSave={(sections) => savePage({ ...page, sections })}
 *   />
 * </AdminProvider>
 * ```
 */
function PageEditor({
  sections: initialSections,
  allowedSections,
  onSave,
  className,
}: PageEditorProps) {
  const { registry } = useAdmin();
  const [sections, setSections] = React.useState<SectionData[]>(initialSections);
  const [selectedSectionType, setSelectedSectionType] = React.useState<string>(
    allowedSections[0] ?? ''
  );

  const handleAddSection = () => {
    if (!selectedSectionType) return;
    const newSection: SectionData = {
      type: selectedSectionType,
      data: {},
    };
    setSections([...sections, newSection]);
  };

  const handleRemoveSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    const temp = newSections[index] as SectionData;
    newSections[index] = newSections[index - 1] as SectionData;
    newSections[index - 1] = temp;
    setSections(newSections);
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index] as SectionData;
    newSections[index] = newSections[index + 1] as SectionData;
    newSections[index + 1] = temp;
    setSections(newSections);
  };

  const handleSectionChange = (index: number, data: Record<string, unknown>) => {
    const newSections = [...sections];
    const current = newSections[index];
    if (current) {
      newSections[index] = { ...current, data };
    }
    setSections(newSections);
  };

  const handleSave = () => {
    onSave(sections);
  };

  return (
    <div className={cn('space-y-6', className)} data-testid="page-editor">
      {sections.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No sections yet. Add a section to get started.
        </p>
      ) : (
        <div className="space-y-4">
          {sections.map((section, index) => {
            const sectionDef = registry.getSection(section.type);
            const sectionLabel = sectionDef?.name ?? section.type;

            return (
              <div
                key={`${section.type}-${index}`}
                className="rounded-md border border-input bg-background p-4"
                data-testid={`page-section-${index}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold capitalize">
                    {sectionLabel}
                  </h3>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      title="Move up"
                      data-testid={`section-move-up-${index}`}
                    >
                      ↑
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === sections.length - 1}
                      title="Move down"
                      data-testid={`section-move-down-${index}`}
                    >
                      ↓
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSection(index)}
                      title="Remove section"
                      data-testid={`section-remove-${index}`}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
                <SectionEditor
                  sectionType={section.type}
                  data={section.data}
                  onChange={(data) => handleSectionChange(index, data)}
                  submitLabel="Update Section"
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-input pt-4">
        <select
          value={selectedSectionType}
          onChange={(e) => setSelectedSectionType(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          data-testid="section-type-select"
        >
          {allowedSections.map((type) => {
            const sectionDef = registry.getSection(type);
            return (
              <option key={type} value={type}>
                {sectionDef?.name ?? type}
              </option>
            );
          })}
        </select>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddSection}
          data-testid="add-section"
        >
          Add Section
        </Button>
      </div>

      <div className="border-t border-input pt-4">
        <Button
          type="button"
          onClick={handleSave}
          data-testid="save-page"
        >
          Save Page
        </Button>
      </div>
    </div>
  );
}

PageEditor.displayName = 'PageEditor';

export { PageEditor };
