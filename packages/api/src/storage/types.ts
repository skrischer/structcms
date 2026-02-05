/**
 * Represents a section within a page
 */
export interface PageSection {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

/**
 * Represents a CMS page with sections
 */
export interface Page {
  id: string;
  slug: string;
  pageType: string;
  title: string;
  sections: PageSection[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input for creating a new page
 */
export interface CreatePageInput {
  slug?: string;
  pageType: string;
  title: string;
  sections?: PageSection[];
}

/**
 * Input for updating an existing page
 */
export interface UpdatePageInput {
  id: string;
  slug?: string;
  pageType?: string;
  title?: string;
  sections?: PageSection[];
}

/**
 * Filter options for listing pages
 */
export interface PageFilter {
  pageType?: string;
  limit?: number;
  offset?: number;
}

/**
 * Represents a navigation structure
 */
export interface Navigation {
  id: string;
  name: string;
  items: NavigationItem[];
  updatedAt: Date;
}

/**
 * A navigation item (recursive for nested menus)
 */
export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

/**
 * Input for creating a navigation
 */
export interface CreateNavigationInput {
  name: string;
  items: NavigationItem[];
}

/**
 * Input for updating a navigation
 */
export interface UpdateNavigationInput {
  id: string;
  name?: string;
  items?: NavigationItem[];
}

/**
 * Storage adapter interface for page and navigation persistence.
 * This interface is Supabase-agnostic to allow future portability.
 */
export interface StorageAdapter {
  // Page operations
  getPage(slug: string): Promise<Page | null>;
  getPageById(id: string): Promise<Page | null>;
  createPage(input: CreatePageInput): Promise<Page>;
  updatePage(input: UpdatePageInput): Promise<Page>;
  deletePage(id: string): Promise<void>;
  listPages(filter?: PageFilter): Promise<Page[]>;

  // Navigation operations
  getNavigation(name: string): Promise<Navigation | null>;
  getNavigationById(id: string): Promise<Navigation | null>;
  createNavigation(input: CreateNavigationInput): Promise<Navigation>;
  updateNavigation(input: UpdateNavigationInput): Promise<Navigation>;
  deleteNavigation(id: string): Promise<void>;
  listNavigations(): Promise<Navigation[]>;
}
