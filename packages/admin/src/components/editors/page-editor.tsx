'use client';

import type { SectionData } from '@structcms/core';
import { ChevronDown, ChevronUp, Plus, Save, X } from 'lucide-react';
import * as React from 'react';
import { useAdmin } from '../../hooks/use-admin';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { SectionEditor } from './section-editor';

export interface PageEditorProps {
  sections: SectionData[];
  allowedSections: string[];
  onSave: (sections: SectionData[]) => void;
  className?: string;
}

interface SectionWithKey {
  key: string;
  section: SectionData;
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
  const keyCounterRef = React.useRef(0);
  const sectionKeysRef = React.useRef<string[]>([]);

  // Ensure we have enough stable keys for current sections
  while (sectionKeysRef.current.length < sections.length) {
    sectionKeysRef.current.push(`section-${keyCounterRef.current++}`);
  }

  const sectionsWithKeys = sections.map((section, idx) => ({
    key: sectionKeysRef.current[idx] as string,
    section,
  }));

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
    sectionKeysRef.current.splice(index, 1);
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
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-[var(--admin-gray-100)] p-3 mb-3">
            <Plus size={20} strokeWidth={1.5} className="text-[var(--admin-gray-400)]" />
          </div>
          <p className="text-[14px] text-[var(--admin-gray-500)]">
            No sections yet. Add a section to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sectionsWithKeys.map(({ key, section }, index) => {
            const sectionDef = registry.getSection(section.type);
            const sectionLabel = sectionDef?.name ?? section.type;

            return (
              <div
                key={key}
                className="rounded-lg border border-[var(--admin-border-default)] bg-[var(--admin-surface-card)] shadow-[var(--admin-shadow-xs)]"
                data-testid={`page-section-${index}`}
              >
                <div className="flex items-center justify-between border-b border-[var(--admin-border-default)] px-5 py-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold leading-[1.3] text-[var(--admin-gray-900)] capitalize">
                      {sectionLabel}
                    </h3>
                    <Badge variant="primary">{section.type}</Badge>
                  </div>
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
                      <ChevronUp size={16} strokeWidth={1.5} />
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
                      <ChevronDown size={16} strokeWidth={1.5} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSection(index)}
                      title="Remove section"
                      data-testid={`section-remove-${index}`}
                    >
                      <X size={16} strokeWidth={1.5} />
                    </Button>
                  </div>
                </div>
                <div className="p-5">
                  <SectionEditor
                    sectionType={section.type}
                    data={section.data}
                    onChange={(data) => handleSectionChange(index, data)}
                    submitLabel="Update Section"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-[var(--admin-border-default)] pt-4">
        <select
          value={selectedSectionType}
          onChange={(e) => setSelectedSectionType(e.target.value)}
          className="flex h-9 rounded-md border border-[var(--admin-gray-200)] bg-[var(--admin-surface-card)] px-3 py-2 text-[14px] text-[var(--admin-gray-700)] focus-visible:outline-none focus-visible:border-[var(--admin-primary-500)] focus-visible:ring-[3px] focus-visible:ring-[var(--admin-shadow-ring)]"
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
          variant="secondary"
          onClick={handleAddSection}
          data-testid="add-section"
        >
          <Plus size={16} strokeWidth={2} />
          Add Section
        </Button>
      </div>

      <div className="border-t border-[var(--admin-border-default)] bg-[var(--admin-gray-50)] -mx-6 px-6 py-4 rounded-b-lg">
        <Button type="button" onClick={handleSave} data-testid="save-page">
          <Save size={16} strokeWidth={2} />
          Save Page
        </Button>
      </div>
    </div>
  );
}

PageEditor.displayName = 'PageEditor';

export { PageEditor };
