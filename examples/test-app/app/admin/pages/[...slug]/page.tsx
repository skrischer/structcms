'use client';

import {
  Badge,
  Breadcrumb,
  Button,
  Input,
  Label,
  PageEditor,
  Skeleton,
  useAdmin,
  useApiClient,
} from '@structcms/admin';
import type { SectionData } from '@structcms/core';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';

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
  const [_saving, setSaving] = React.useState(false);
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
    setError(null);
    try {
      const result = await apiClient.put(`/pages/id/${page.id}`, {
        title,
        sections: updatedSections,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      router.push('/admin/pages');
    } catch (err) {
      setError('Failed to update page');
      console.error('Failed to update page:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto space-y-6 py-6">
        <Skeleton className="h-4 w-48" shape="text" />
        <Skeleton className="h-8 w-64" shape="text" />
        <div className="rounded-lg border border-[var(--admin-border-default)] bg-[var(--admin-surface-card)] shadow-[var(--admin-shadow-xs)] p-5 space-y-4">
          <Skeleton className="h-4 w-24" shape="text" />
          <Skeleton className="h-9 w-full max-w-md" shape="rect" />
          <Skeleton className="h-4 w-24" shape="text" />
          <Skeleton className="h-9 w-48" shape="rect" />
        </div>
        <Skeleton className="h-64 w-full" shape="rect" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="max-w-[1100px] mx-auto py-6">
        <p className="text-[14px] text-[var(--admin-error-700)]">{error || 'Page not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto space-y-6 py-6">
      <Breadcrumb items={[{ label: 'Pages', href: '/admin/pages' }, { label: page.title }]} />

      <div className="flex items-center gap-3">
        <h1 className="text-[24px] font-semibold leading-[1.3] tracking-[-0.01em] text-[var(--admin-gray-900)]">
          Edit Page
        </h1>
        <Badge variant="default">{page.pageType}</Badge>
      </div>

      <div className="rounded-lg border border-[var(--admin-border-default)] bg-[var(--admin-surface-card)] shadow-[var(--admin-shadow-xs)]">
        <div className="border-b border-[var(--admin-border-default)] px-5 py-3">
          <h2 className="text-[16px] font-semibold leading-[1.3] text-[var(--admin-gray-900)]">
            Page Details
          </h2>
        </div>
        <div className="p-5 space-y-4 max-w-md">
          <div className="space-y-1.5">
            <Label htmlFor="title" required>
              Title
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Page Type</Label>
            <p className="text-[14px] text-[var(--admin-gray-600)]">{page.pageType}</p>
          </div>

          <div className="space-y-1.5">
            <Label>Slug</Label>
            <p className="text-[14px] text-[var(--admin-gray-600)]">{page.slug}</p>
          </div>
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
        <Button variant="secondary" onClick={() => router.push('/admin/pages')}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
