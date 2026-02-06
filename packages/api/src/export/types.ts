import type { PageSection } from '../storage/types';

/**
 * Export response for a single page with resolved media URLs
 */
export interface PageExportResponse {
  id: string;
  slug: string;
  pageType: string;
  title: string;
  sections: PageSection[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Export response for all pages
 */
export interface AllPagesExportResponse {
  pages: PageExportResponse[];
  exportedAt: string;
}

/**
 * Export response for navigation structures
 */
export interface NavigationExportResponse {
  id: string;
  name: string;
  items: import('../storage/types').NavigationItem[];
  updatedAt: string;
}

/**
 * Export response for all navigations
 */
export interface AllNavigationsExportResponse {
  navigations: NavigationExportResponse[];
  exportedAt: string;
}

/**
 * Full site export response
 */
export interface SiteExportResponse {
  pages: PageExportResponse[];
  navigations: NavigationExportResponse[];
  media: MediaExportEntry[];
  exportedAt: string;
}

/**
 * Media entry in site export
 */
export interface MediaExportEntry {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

/**
 * Generates a Content-Disposition header value for file download
 */
export function contentDisposition(filename: string): string {
  return `attachment; filename="${filename}"`;
}
