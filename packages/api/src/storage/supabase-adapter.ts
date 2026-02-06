import { SupabaseClient } from '@supabase/supabase-js';
import type {
  StorageAdapter,
  Page,
  PageSection,
  PageFilter,
  CreatePageInput,
  UpdatePageInput,
  Navigation,
  NavigationItem,
  CreateNavigationInput,
  UpdateNavigationInput,
} from './types';

/**
 * Database row types (snake_case)
 */
interface PageRow {
  id: string;
  slug: string;
  page_type: string;
  title: string;
  sections: PageSection[];
  created_at: string;
  updated_at: string;
}

interface NavigationRow {
  id: string;
  name: string;
  items: NavigationItem[];
  created_at: string;
  updated_at: string;
}

/**
 * Maps a database page row to the Page type
 */
function mapPageRowToPage(row: PageRow): Page {
  return {
    id: row.id,
    slug: row.slug,
    pageType: row.page_type,
    title: row.title,
    sections: row.sections,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Maps a database navigation row to the Navigation type
 */
function mapNavigationRowToNavigation(row: NavigationRow): Navigation {
  return {
    id: row.id,
    name: row.name,
    items: row.items,
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Storage adapter error with additional context
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: string
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Configuration for creating a Supabase storage adapter
 */
export interface SupabaseStorageAdapterConfig {
  client: SupabaseClient;
}

/**
 * Supabase implementation of the StorageAdapter interface
 */
export class SupabaseStorageAdapter implements StorageAdapter {
  private client: SupabaseClient;

  constructor(config: SupabaseStorageAdapterConfig) {
    this.client = config.client;
  }

  async getPage(slug: string): Promise<Page | null> {
    const { data, error } = await this.client
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new StorageError(error.message, error.code, error.details);
    }

    return mapPageRowToPage(data as PageRow);
  }

  async getPageById(id: string): Promise<Page | null> {
    const { data, error } = await this.client
      .from('pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new StorageError(error.message, error.code, error.details);
    }

    return mapPageRowToPage(data as PageRow);
  }

  async createPage(input: CreatePageInput): Promise<Page> {
    const { data, error } = await this.client
      .from('pages')
      .insert({
        slug: input.slug,
        page_type: input.pageType,
        title: input.title,
        sections: input.sections ?? [],
      })
      .select()
      .single();

    if (error) {
      throw new StorageError(error.message, error.code, error.details);
    }

    return mapPageRowToPage(data as PageRow);
  }

  async updatePage(input: UpdatePageInput): Promise<Page> {
    const updateData: Record<string, unknown> = {};

    if (input.slug !== undefined) {
      updateData.slug = input.slug;
    }
    if (input.pageType !== undefined) {
      updateData.page_type = input.pageType;
    }
    if (input.title !== undefined) {
      updateData.title = input.title;
    }
    if (input.sections !== undefined) {
      updateData.sections = input.sections;
    }

    const { data, error } = await this.client
      .from('pages')
      .update(updateData)
      .eq('id', input.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new StorageError(`Page not found: ${input.id}`, 'NOT_FOUND');
      }
      throw new StorageError(error.message, error.code, error.details);
    }

    return mapPageRowToPage(data as PageRow);
  }

  async deletePage(id: string): Promise<void> {
    const { error } = await this.client.from('pages').delete().eq('id', id);

    if (error) {
      throw new StorageError(error.message, error.code, error.details);
    }
  }

  async listPages(filter?: PageFilter): Promise<Page[]> {
    let query = this.client.from('pages').select('*');

    if (filter?.pageType) {
      query = query.eq('page_type', filter.pageType);
    }

    query = query.order('created_at', { ascending: false });

    if (filter?.limit) {
      query = query.limit(filter.limit);
    }

    if (filter?.offset) {
      query = query.range(
        filter.offset,
        filter.offset + (filter.limit ?? 100) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      throw new StorageError(error.message, error.code, error.details);
    }

    return (data as PageRow[]).map(mapPageRowToPage);
  }

  async getNavigation(name: string): Promise<Navigation | null> {
    const { data, error } = await this.client
      .from('navigation')
      .select('*')
      .eq('name', name)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new StorageError(error.message, error.code, error.details);
    }

    return mapNavigationRowToNavigation(data as NavigationRow);
  }

  async getNavigationById(id: string): Promise<Navigation | null> {
    const { data, error } = await this.client
      .from('navigation')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new StorageError(error.message, error.code, error.details);
    }

    return mapNavigationRowToNavigation(data as NavigationRow);
  }

  async createNavigation(input: CreateNavigationInput): Promise<Navigation> {
    const { data, error } = await this.client
      .from('navigation')
      .insert({
        name: input.name,
        items: input.items,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new StorageError(
          `Navigation with name "${input.name}" already exists`,
          'DUPLICATE_NAME'
        );
      }
      throw new StorageError(error.message, error.code, error.details);
    }

    return mapNavigationRowToNavigation(data as NavigationRow);
  }

  async updateNavigation(input: UpdateNavigationInput): Promise<Navigation> {
    const updateData: Record<string, unknown> = {};

    if (input.name !== undefined) {
      updateData.name = input.name;
    }
    if (input.items !== undefined) {
      updateData.items = input.items;
    }

    const { data, error } = await this.client
      .from('navigation')
      .update(updateData)
      .eq('id', input.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new StorageError(
          `Navigation not found: ${input.id}`,
          'NOT_FOUND'
        );
      }
      throw new StorageError(error.message, error.code, error.details);
    }

    return mapNavigationRowToNavigation(data as NavigationRow);
  }

  async deleteNavigation(id: string): Promise<void> {
    const { error } = await this.client
      .from('navigation')
      .delete()
      .eq('id', id);

    if (error) {
      throw new StorageError(error.message, error.code, error.details);
    }
  }

  async listNavigations(): Promise<Navigation[]> {
    const { data, error } = await this.client
      .from('navigation')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new StorageError(error.message, error.code, error.details);
    }

    return (data as NavigationRow[]).map(mapNavigationRowToNavigation);
  }
}

/**
 * Creates a storage adapter using Supabase
 */
export function createStorageAdapter(
  config: SupabaseStorageAdapterConfig
): StorageAdapter {
  return new SupabaseStorageAdapter(config);
}
