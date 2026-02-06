import type { StorageAdapter, Page } from '../storage/types';
import type { MediaAdapter } from '../media/types';
import type { PageExportResponse, AllPagesExportResponse, NavigationExportResponse, AllNavigationsExportResponse, SiteExportResponse, MediaExportEntry } from './types';
import { contentDisposition } from './types';
import { resolveMediaReferences } from '../media/resolve';

/**
 * Converts a Page to a PageExportResponse with resolved media references
 */
async function toPageExport(
  page: Page,
  mediaAdapter: MediaAdapter
): Promise<PageExportResponse> {
  const resolvedSections = await resolveMediaReferences(
    page.sections,
    mediaAdapter
  );

  return {
    id: page.id,
    slug: page.slug,
    pageType: page.pageType,
    title: page.title,
    sections: resolvedSections,
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };
}

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

  const data = await toPageExport(page, mediaAdapter);

  return {
    data,
    contentDisposition: contentDisposition(`${page.slug}.json`),
  };
}

/**
 * Handler for GET /api/cms/export/pages
 * Returns all pages as JSON array with resolved media URLs
 */
export async function handleExportAllPages(
  storageAdapter: StorageAdapter,
  mediaAdapter: MediaAdapter
): Promise<{ data: AllPagesExportResponse; contentDisposition: string }> {
  const pages = await storageAdapter.listPages();

  const exportedPages: PageExportResponse[] = [];
  for (const page of pages) {
    exportedPages.push(await toPageExport(page, mediaAdapter));
  }

  const data: AllPagesExportResponse = {
    pages: exportedPages,
    exportedAt: new Date().toISOString(),
  };

  return {
    data,
    contentDisposition: contentDisposition('pages-export.json'),
  };
}

/**
 * Handler for GET /api/cms/export/navigation
 * Returns all navigation structures as JSON
 */
export async function handleExportNavigations(
  storageAdapter: StorageAdapter
): Promise<{ data: AllNavigationsExportResponse; contentDisposition: string }> {
  const navigations = await storageAdapter.listNavigations();

  const exported: NavigationExportResponse[] = navigations.map((nav) => ({
    id: nav.id,
    name: nav.name,
    items: nav.items,
    updatedAt: nav.updatedAt.toISOString(),
  }));

  const data: AllNavigationsExportResponse = {
    navigations: exported,
    exportedAt: new Date().toISOString(),
  };

  return {
    data,
    contentDisposition: contentDisposition('navigation-export.json'),
  };
}

/**
 * Handler for GET /api/cms/export
 * Returns complete site content (pages, navigation, media metadata) as JSON
 */
export async function handleExportSite(
  storageAdapter: StorageAdapter,
  mediaAdapter: MediaAdapter
): Promise<{ data: SiteExportResponse; contentDisposition: string }> {
  // Export pages with resolved media
  const pages = await storageAdapter.listPages();
  const exportedPages: PageExportResponse[] = [];
  for (const page of pages) {
    exportedPages.push(await toPageExport(page, mediaAdapter));
  }

  // Export navigations
  const navigations = await storageAdapter.listNavigations();
  const exportedNavigations: NavigationExportResponse[] = navigations.map((nav) => ({
    id: nav.id,
    name: nav.name,
    items: nav.items,
    updatedAt: nav.updatedAt.toISOString(),
  }));

  // Export media metadata
  const mediaFiles = await mediaAdapter.listMedia();
  const exportedMedia: MediaExportEntry[] = mediaFiles.map((file) => ({
    id: file.id,
    filename: file.filename,
    url: file.url,
    mimeType: file.mimeType,
    size: file.size,
    createdAt: file.createdAt.toISOString(),
  }));

  const data: SiteExportResponse = {
    pages: exportedPages,
    navigations: exportedNavigations,
    media: exportedMedia,
    exportedAt: new Date().toISOString(),
  };

  return {
    data,
    contentDisposition: contentDisposition('site-export.json'),
  };
}
