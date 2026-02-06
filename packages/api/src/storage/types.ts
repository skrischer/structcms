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
 * Storage adapter interface for page and navigation persistence
 * This interface is Supabase-agnostic to allow future portability
 */
export interface StorageAdapter {
  /** Get a page by its slug */
  getPage(slug: string): Promise<Page | null>;

  /** Get a page by its ID */
  getPageById(id: string): Promise<Page | null>;

  /** Create a new page */
  createPage(input: CreatePageInput): Promise<Page>;

  /** Update an existing page */
  updatePage(input: UpdatePageInput): Promise<Page>;

  /** Delete a page by ID */
  deletePage(id: string): Promise<void>;

  /** List pages with optional filtering and pagination */
  listPages(filter?: PageFilter): Promise<Page[]>;

  /** Get a navigation by its name */
  getNavigation(name: string): Promise<Navigation | null>;

  /** Get a navigation by its ID */
  getNavigationById(id: string): Promise<Navigation | null>;

  /** Create a new navigation */
  createNavigation(input: CreateNavigationInput): Promise<Navigation>;

  /** Update an existing navigation */
  updateNavigation(input: UpdateNavigationInput): Promise<Navigation>;

  /** Delete a navigation by ID */
  deleteNavigation(id: string): Promise<void>;

  /** List all navigations */
  listNavigations(): Promise<Navigation[]>;
}
