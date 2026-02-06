import type { PageSection } from '../storage/types';
import type { MediaAdapter } from './types';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Convention: fields ending with these suffixes are treated as media references
 */
const MEDIA_FIELD_SUFFIXES = ['_image', '_media', '_photo', '_thumbnail', '_avatar', '_icon'];

/**
 * Checks if a field name is a media reference field by convention
 */
function isMediaField(fieldName: string): boolean {
  const lower = fieldName.toLowerCase();
  if (lower === 'image' || lower === 'media' || lower === 'photo' || lower === 'thumbnail' || lower === 'avatar' || lower === 'icon') {
    return true;
  }
  return MEDIA_FIELD_SUFFIXES.some((suffix) => lower.endsWith(suffix));
}

/**
 * Checks if a value looks like a media ID (UUID format)
 */
function isMediaId(value: unknown): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}

/**
 * Resolves media references in a single data object.
 * Walks all fields and replaces media IDs with public URLs.
 * Returns a new object with resolved references.
 */
async function resolveDataObject(
  data: Record<string, unknown>,
  adapter: MediaAdapter
): Promise<Record<string, unknown>> {
  const resolved: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (isMediaField(key) && isMediaId(value)) {
      const media = await adapter.getMedia(value);
      resolved[key] = media ? media.url : null;
    } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      resolved[key] = await resolveDataObject(
        value as Record<string, unknown>,
        adapter
      );
    } else {
      resolved[key] = value;
    }
  }

  return resolved;
}

/**
 * Resolves media references in page sections.
 * Walks section data fields and replaces media IDs (UUIDs) with public URLs.
 *
 * Convention: Fields named "image", "media", "photo", "thumbnail", "avatar", "icon"
 * or ending with "_image", "_media", etc. are treated as media references.
 *
 * Missing media is resolved to null.
 */
export async function resolveMediaReferences(
  sections: PageSection[],
  adapter: MediaAdapter
): Promise<PageSection[]> {
  const resolved: PageSection[] = [];

  for (const section of sections) {
    const resolvedData = await resolveDataObject(section.data, adapter);
    resolved.push({
      id: section.id,
      type: section.type,
      data: resolvedData,
    });
  }

  return resolved;
}
