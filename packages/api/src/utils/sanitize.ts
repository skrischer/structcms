import sanitizeHtml from 'sanitize-html';
import type { PageSection } from '../storage/types';

/**
 * Allowed HTML tags for sanitization
 */
const ALLOWED_TAGS = [
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'a',
  'strong',
  'em',
  'br',
  'blockquote',
  'code',
  'pre',
  'img',
];

/**
 * Allowed HTML attributes per tag
 */
const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ['href'],
  img: ['src', 'alt'],
};

/**
 * Sanitize-html configuration
 */
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: ALLOWED_ATTRIBUTES,
  disallowedTagsMode: 'discard',
};

/**
 * Sanitize a single string value using the configured allowlist
 */
export function sanitizeString(value: string): string {
  return sanitizeHtml(value, SANITIZE_OPTIONS);
}

/**
 * Strip all HTML tags from a string (for plain text fields like titles, names)
 */
export function stripTags(value: string): string {
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

/**
 * Recursively sanitize all string values in an unknown data structure
 */
export function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[key] = sanitizeValue(val);
    }
    return result;
  }

  // number, boolean, null, undefined — pass through
  return value;
}

/**
 * Sanitize all string values in page sections' data
 * Returns a new array with sanitized sections (does not mutate input)
 */
export function sanitizeSectionData(sections: PageSection[]): PageSection[] {
  return sections.map((section) => ({
    ...section,
    data: sanitizeValue(section.data) as Record<string, unknown>,
  }));
}
