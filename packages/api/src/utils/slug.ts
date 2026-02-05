/**
 * Character replacements for German umlauts and special characters
 */
const UMLAUT_MAP: Record<string, string> = {
  ä: 'ae',
  ö: 'oe',
  ü: 'ue',
  Ä: 'Ae',
  Ö: 'Oe',
  Ü: 'Ue',
  ß: 'ss',
};

/**
 * Generates a URL-safe slug from a title string.
 *
 * @param title - The title to convert to a slug
 * @returns A URL-safe slug
 *
 * @example
 * generateSlug('Hello World') // 'hello-world'
 * generateSlug('Über uns') // 'ueber-uns'
 * generateSlug('  Multiple   Spaces  ') // 'multiple-spaces'
 */
export function generateSlug(title: string): string {
  let slug = title.toLowerCase().trim();

  // Replace German umlauts
  for (const [umlaut, replacement] of Object.entries(UMLAUT_MAP)) {
    slug = slug.replace(new RegExp(umlaut, 'g'), replacement.toLowerCase());
  }

  // Replace spaces and underscores with hyphens
  slug = slug.replace(/[\s_]+/g, '-');

  // Remove all non-alphanumeric characters except hyphens
  slug = slug.replace(/[^a-z0-9-]/g, '');

  // Remove multiple consecutive hyphens
  slug = slug.replace(/-+/g, '-');

  // Remove leading and trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '');

  return slug;
}

/**
 * Ensures a slug is unique by appending a numeric suffix if needed.
 *
 * @param slug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 *
 * @example
 * ensureUniqueSlug('hello', ['hello', 'world']) // 'hello-1'
 * ensureUniqueSlug('hello', ['hello', 'hello-1']) // 'hello-2'
 * ensureUniqueSlug('new', ['hello', 'world']) // 'new'
 */
export function ensureUniqueSlug(
  slug: string,
  existingSlugs: string[]
): string {
  if (!existingSlugs.includes(slug)) {
    return slug;
  }

  let counter = 1;
  let uniqueSlug = `${slug}-${counter}`;

  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }

  return uniqueSlug;
}
