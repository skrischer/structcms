'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { PageEditor, useAdmin, useApiClient, Button, Label } from '@structcms/admin';
import type { SectionData } from '@structcms/core';

export default function CreatePagePage() {
  const router = useRouter();
  const { registry } = useAdmin();
  const apiClient = useApiClient();
  
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [pageType, setPageType] = React.useState('');
  const [sections, setSections] = React.useState<SectionData[]>([]);
  const [saving, setSaving] = React.useState(false);

  const pageTypes = registry.getAllPageTypes();
  const selectedPageType = pageTypes.find((pt) => pt.name === pageType);
  const allowedSections = selectedPageType?.allowedSections ?? [];

  const handleSave = async (updatedSections: SectionData[]) => {
    if (!title || !pageType) return;
    
    setSaving(true);
    try {
      await apiClient.post('/pages', {
        title,
        slug: slug || undefined,
        pageType,
        sections: updatedSections,
      });
      router.push('/admin/pages');
    } catch (error) {
      console.error('Failed to create page:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create New Page</h1>
      
      <div className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="title">Title</Label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Page title"
          />
        </div>
        
        <div>
          <Label htmlFor="slug">Slug (optional)</Label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="page-slug"
          />
        </div>
        
        <div>
          <Label htmlFor="pageType">Page Type</Label>
          <select
            id="pageType"
            value={pageType}
            onChange={(e) => {
              setPageType(e.target.value);
              setSections([]);
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select page type...</option>
            {pageTypes.map((pt) => (
              <option key={pt.name} value={pt.name}>
                {pt.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {pageType && allowedSections.length > 0 && (
        <PageEditor
          sections={sections}
          allowedSections={allowedSections}
          onSave={handleSave}
        />
      )}

      {!pageType && (
        <p className="text-gray-500">Select a page type to add sections.</p>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/pages')}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
