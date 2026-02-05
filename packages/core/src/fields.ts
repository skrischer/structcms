import { z } from 'zod';
import type { FieldMeta, FieldType } from './types';

const FIELD_META_PREFIX = '__structcms_field__';

/**
 * Encodes field metadata into a Zod description string
 */
function encodeFieldMeta(fieldType: FieldType): string {
  const meta: FieldMeta = { fieldType };
  return `${FIELD_META_PREFIX}${JSON.stringify(meta)}`;
}

/**
 * Extracts field metadata from a Zod schema's description
 */
export function getFieldMeta(schema: z.ZodTypeAny): FieldMeta | null {
  const description = schema.description;
  if (!description?.startsWith(FIELD_META_PREFIX)) {
    return null;
  }
  try {
    return JSON.parse(description.slice(FIELD_META_PREFIX.length)) as FieldMeta;
  } catch {
    return null;
  }
}

/**
 * Checks if a schema has a specific field type
 */
export function isFieldType(
  schema: z.ZodTypeAny,
  fieldType: FieldType
): boolean {
  const meta = getFieldMeta(schema);
  return meta?.fieldType === fieldType;
}

/**
 * Field type helpers for defining CMS content schemas.
 * These wrap Zod schemas with metadata for the Admin UI.
 */
export const fields = {
  /**
   * Short text field (single line input)
   * @example fields.string().min(1).max(100)
   */
  string: () => z.string().describe(encodeFieldMeta('string')),

  /**
   * Long text field (textarea)
   * @example fields.text().min(10)
   */
  text: () => z.string().describe(encodeFieldMeta('text')),

  /**
   * Rich text field (WYSIWYG editor, outputs HTML)
   * @example fields.richtext()
   */
  richtext: () => z.string().describe(encodeFieldMeta('richtext')),

  /**
   * Image field (media reference)
   * Stores media ID or URL
   * @example fields.image()
   */
  image: () => z.string().describe(encodeFieldMeta('image')),

  /**
   * Reference field (page reference)
   * Stores page slug or ID
   * @example fields.reference()
   */
  reference: () => z.string().describe(encodeFieldMeta('reference')),

  /**
   * Array field wrapper with metadata
   * @example fields.array(z.string())
   */
  array: <T extends z.ZodTypeAny>(itemSchema: T) =>
    z.array(itemSchema).describe(encodeFieldMeta('array')),

  /**
   * Object field wrapper with metadata
   * @example fields.object({ nested: z.string() })
   */
  object: <T extends z.ZodRawShape>(shape: T) =>
    z.object(shape).describe(encodeFieldMeta('object')),
};
