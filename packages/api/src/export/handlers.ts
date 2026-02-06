import type { StorageAdapter } from '../storage/types';
import type { MediaAdapter } from '../media/types';
import type { PageExportResponse } from './types';
import { contentDisposition } from './types';
import { resolveMediaReferences } from '../media/resolve';

/**
 * Handler for GET /api/cms/export/pages/:slug
 * Returns complete page JSON with resolved media URLs
 */
export async function handleExportPage(
  storageAdapter: StorageAdapter,
  mediaAdapter: MediaAdapter,
  slug: string
): Promise<{ data: PageExportResponse; contentDisposition: string } | null> {
  const page = await storageAdapter.getPage(slug);

  if (!page) {
    return null;
  }

  const resolvedSections = await resolveMediaReferences(
    page.sections,
    mediaAdapter
  );

  const data: PageExportResponse = {
    id: page.id,
    slug: page.slug,
    pageType: page.pageType,
    title: page.title,
    sections: resolvedSections,
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };

  return {
    data,
    contentDisposition: contentDisposition(`${page.slug}.json`),
  };
}
