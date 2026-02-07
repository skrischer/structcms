import type { StorageAdapter, Page, Navigation, CreatePageInput, UpdatePageInput, CreateNavigationInput, UpdateNavigationInput } from './types';
import { generateSlug, ensureUniqueSlug } from '../utils/slug';
import { sanitizeSectionData } from '../utils/sanitize';

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
 * Handler for creating a new page
 * Generates a slug from the title if not provided and ensures uniqueness
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

  const sanitizedSections = input.sections
    ? sanitizeSectionData(input.sections)
    : undefined;

  return adapter.createPage({
    ...input,
    slug: uniqueSlug,
    sections: sanitizedSections,
  });
}

/**
 * Handler for updating an existing page
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

  const sanitizedInput = input.sections
    ? { ...input, sections: sanitizeSectionData(input.sections) }
    : input;

  return adapter.updatePage(sanitizedInput);
}

/**
 * Handler for deleting a page by ID
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

/**
 * Handler for creating a new navigation
 * Validates that the name is non-empty and unique
 */
export async function handleCreateNavigation(
  adapter: StorageAdapter,
  input: CreateNavigationInput
): Promise<Navigation> {
  if (!input.name.trim()) {
    throw new StorageValidationError(
      'Navigation name must not be empty',
      'EMPTY_NAME'
    );
  }

  // Ensure name uniqueness
  const existingNavigations = await adapter.listNavigations();
  const existingNames = existingNavigations.map((n) => n.name);

  if (existingNames.includes(input.name.trim())) {
    throw new StorageValidationError(
      `Navigation name "${input.name.trim()}" is already in use`,
      'DUPLICATE_NAME'
    );
  }

  return adapter.createNavigation(input);
}

/**
 * Handler for updating an existing navigation
 */
export async function handleUpdateNavigation(
  adapter: StorageAdapter,
  input: UpdateNavigationInput
): Promise<Navigation> {
  if (!input.id.trim()) {
    throw new StorageValidationError(
      'Navigation ID must not be empty',
      'EMPTY_ID'
    );
  }

  // If name is being updated, ensure uniqueness
  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) {
      throw new StorageValidationError(
        'Navigation name must not be empty',
        'EMPTY_NAME'
      );
    }

    const existingNavigations = await adapter.listNavigations();
    const existingNames = existingNavigations
      .filter((n) => n.id !== input.id)
      .map((n) => n.name);

    if (existingNames.includes(name)) {
      throw new StorageValidationError(
        `Navigation name "${name}" is already in use`,
        'DUPLICATE_NAME'
      );
    }
  }

  return adapter.updateNavigation(input);
}

/**
 * Handler for deleting a navigation by ID
 */
export async function handleDeleteNavigation(
  adapter: StorageAdapter,
  id: string
): Promise<void> {
  if (!id.trim()) {
    throw new StorageValidationError(
      'Navigation ID must not be empty',
      'EMPTY_ID'
    );
  }

  return adapter.deleteNavigation(id);
}
