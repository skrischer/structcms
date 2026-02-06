import type { StorageAdapter, Page, CreatePageInput, UpdatePageInput } from './types';
import { generateSlug, ensureUniqueSlug } from '../utils/slug';

/**
 * Error thrown when storage validation fails
 */
export class StorageValidationError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'StorageValidationError';
  }
}

/**
 * Handler for creating a new page.
 * Generates a slug from the title if not provided and ensures uniqueness.
 */
export async function handleCreatePage(
  adapter: StorageAdapter,
  input: CreatePageInput
): Promise<Page> {
  if (!input.title.trim()) {
    throw new StorageValidationError(
      'Page title must not be empty',
      'EMPTY_TITLE'
    );
  }

  const slug = input.slug?.trim() || generateSlug(input.title);

  if (!slug) {
    throw new StorageValidationError(
      'Could not generate a valid slug from the provided title',
      'INVALID_SLUG'
    );
  }

  // Ensure slug uniqueness
  const existingPages = await adapter.listPages();
  const existingSlugs = existingPages.map((p) => p.slug);
  const uniqueSlug = ensureUniqueSlug(slug, existingSlugs);

  return adapter.createPage({
    ...input,
    slug: uniqueSlug,
  });
}

/**
 * Handler for updating an existing page.
 */
export async function handleUpdatePage(
  adapter: StorageAdapter,
  input: UpdatePageInput
): Promise<Page> {
  if (!input.id.trim()) {
    throw new StorageValidationError(
      'Page ID must not be empty',
      'EMPTY_ID'
    );
  }

  if (input.title !== undefined && !input.title.trim()) {
    throw new StorageValidationError(
      'Page title must not be empty',
      'EMPTY_TITLE'
    );
  }

  // If slug is being updated, ensure uniqueness
  if (input.slug !== undefined) {
    const slug = input.slug.trim();
    if (!slug) {
      throw new StorageValidationError(
        'Page slug must not be empty',
        'EMPTY_SLUG'
      );
    }

    const existingPages = await adapter.listPages();
    const existingSlugs = existingPages
      .filter((p) => p.id !== input.id)
      .map((p) => p.slug);

    if (existingSlugs.includes(slug)) {
      throw new StorageValidationError(
        `Slug "${slug}" is already in use`,
        'DUPLICATE_SLUG'
      );
    }
  }

  return adapter.updatePage(input);
}

/**
 * Handler for deleting a page by ID.
 */
export async function handleDeletePage(
  adapter: StorageAdapter,
  id: string
): Promise<void> {
  if (!id.trim()) {
    throw new StorageValidationError(
      'Page ID must not be empty',
      'EMPTY_ID'
    );
  }

  return adapter.deletePage(id);
}
