import { resolveMediaReferences } from '../media/resolve';
import type { MediaAdapter } from '../media/types';
import type { Navigation, Page, StorageAdapter } from '../storage/types';
import type { ListPagesOptions, NavigationResponse, PageResponse } from './types';

/**
 * Maps internal Page type to PageResponse for delivery API with resolved media references
 */
async function toPageResponse(page: Page, mediaAdapter: MediaAdapter): Promise<PageResponse> {
  const resolvedSections = await resolveMediaReferences(page.sections, mediaAdapter);

  return {
    id: page.id,
    slug: page.slug,
    pageType: page.pageType,
    title: page.title,
    sections: resolvedSections,
    meta: {
      createdAt: page.createdAt.toISOString(),
      updatedAt: page.updatedAt.toISOString(),
    },
  };
}

/**
 * Maps internal Navigation type to NavigationResponse for delivery API
 */
function toNavigationResponse(navigation: Navigation): NavigationResponse {
  return {
    id: navigation.id,
    name: navigation.name,
    items: navigation.items,
    meta: {
      updatedAt: navigation.updatedAt.toISOString(),
    },
  };
}

/**
 * Handler for GET /api/cms/pages
 * Returns all pages with resolved media references, optionally filtered by pageType
 */
export async function handleListPages(
  adapter: StorageAdapter,
  mediaAdapter: MediaAdapter,
  options?: ListPagesOptions
): Promise<PageResponse[]> {
  const pages = await adapter.listPages({
    pageType: options?.pageType,
    limit: options?.limit,
    offset: options?.offset,
  });

  const results: PageResponse[] = [];
  for (const page of pages) {
    results.push(await toPageResponse(page, mediaAdapter));
  }

  return results;
}

/**
 * Handler for GET /api/cms/pages/:slug
 * Returns a single page by slug with resolved media references, or null if not found
 */
export async function handleGetPageBySlug(
  adapter: StorageAdapter,
  mediaAdapter: MediaAdapter,
  slug: string
): Promise<PageResponse | null> {
  const page = await adapter.getPage(slug);

  if (!page) {
    return null;
  }

  return toPageResponse(page, mediaAdapter);
}

/**
 * Handler for GET /api/cms/navigation/:name
 * Returns a navigation by name, or null if not found
 */
export async function handleGetNavigation(
  adapter: StorageAdapter,
  name: string
): Promise<NavigationResponse | null> {
  const navigation = await adapter.getNavigation(name);

  if (!navigation) {
    return null;
  }

  return toNavigationResponse(navigation);
}
