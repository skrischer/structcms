'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageEditor, useAdmin, useApiClient, Button, Label, Skeleton } from '@structcms/admin';
import type { SectionData } from '@structcms/core';

interface PageData {
  id: string;
  slug: string;
  title: string;
  pageType: string;
  sections: SectionData[];
}

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const slugSegments = params.slug as string[];
  const slug = slugSegments.join('/');
  const { registry } = useAdmin();
  const apiClient = useApiClient();
  
  const [page, setPage] = React.useState<PageData | null>(null);
  const [title, setTitle] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await apiClient.get<PageData>(`/pages/${slug}`);
        if (response.data) {
          setPage(response.data);
          setTitle(response.data.title);
        }
      } catch (err) {
        setError('Failed to load page');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug, apiClient]);

  const pageType = page ? registry.getPageType(page.pageType) : null;
  const allowedSections = pageType?.allowedSections ?? [];

  const handleSave = async (updatedSections: SectionData[]) => {
    if (!page) return;
    
    setSaving(true);
    try {
      await apiClient.put(`/pages/${slug}`, {
        title,
        sections: updatedSections,
      });
      router.push('/admin/pages');
    } catch (err) {
      console.error('Failed to update page:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="text-red-600">
        {error || 'Page not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Page: {page.title}</h1>
      
      <div className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="title">Title</Label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        
        <div>
          <Label>Page Type</Label>
          <p className="text-gray-600">{page.pageType}</p>
        </div>
        
        <div>
          <Label>Slug</Label>
          <p className="text-gray-600">{page.slug}</p>
        </div>
      </div>

      {allowedSections.length > 0 && (
        <PageEditor
          sections={page.sections}
          allowedSections={allowedSections}
          onSave={handleSave}
        />
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
