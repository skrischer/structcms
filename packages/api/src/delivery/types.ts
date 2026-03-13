import type { NavigationItem, PageSection } from '../storage/types';

/**
 * Page response for delivery API
 * Dates are serialized as ISO strings for JSON transport
 */
export interface PageResponse {
  id: string;
  slug: string;
  pageType: string;
  title: string;
  sections: PageSection[];
  meta: {
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Navigation response for delivery API
 */
export interface NavigationResponse {
  id: string;
  name: string;
  items: NavigationItem[];
  meta: {
    updatedAt: string;
  };
}

/**
 * Filter options for listing pages via delivery API
 */
export interface ListPagesOptions {
  pageType?: string;
  limit?: number;
  offset?: number;
}
