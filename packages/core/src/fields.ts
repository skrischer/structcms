import { z } from 'zod';
import type { FieldMeta, FieldType } from './types';

const FIELD_META_PREFIX = '__structcms_field__';

/**
 * Encodes field metadata into a Zod description string
 */
function encodeFieldMeta(
  fieldType: FieldType,
  extra?: Omit<FieldMeta, 'version' | 'fieldType'>
): string {
  const meta: FieldMeta = { version: 1, fieldType, ...extra };
  return `${FIELD_META_PREFIX}${JSON.stringify(meta)}`;
}

/**
 * Extracts field metadata from a Zod schema's description
 * Assumes version 1 if no version is present (backward compatibility)
 */
export function getFieldMeta(schema: z.ZodTypeAny): FieldMeta | null {
  const description = schema.description;
  if (!description?.startsWith(FIELD_META_PREFIX)) {
    return null;
  }
  try {
    const parsed = JSON.parse(description.slice(FIELD_META_PREFIX.length)) as Partial<FieldMeta>;
    // Backward compatibility: assume version 1 if not present
    const meta: FieldMeta = {
      version: parsed.version ?? 1,
      fieldType: parsed.fieldType as FieldType,
    };
    if (parsed.options) {
      meta.options = parsed.options;
    }
    if (parsed.allowedBlocks) {
      meta.allowedBlocks = parsed.allowedBlocks;
    }
    if (parsed.visibleWhen) {
      meta.visibleWhen = parsed.visibleWhen;
    }
    return meta;
  } catch {
    return null;
  }
}

/**
 * Checks if a schema has a specific field type
 */
export function isFieldType(schema: z.ZodTypeAny, fieldType: FieldType): boolean {
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
   * @example fields.richtext({ allowedBlocks: ['paragraph', 'heading2'] })
   */
  richtext: (config?: { allowedBlocks?: readonly string[] }) => {
    const extra = config?.allowedBlocks ? { allowedBlocks: config.allowedBlocks } : undefined;
    return z.string().describe(encodeFieldMeta('richtext', extra));
  },

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

  /**
   * Boolean field (checkbox/toggle)
   * @example fields.boolean()
   */
  boolean: () => z.boolean().describe(encodeFieldMeta('boolean')),

  /**
   * Select field (dropdown or radio group)
   * Uses z.enum() for full type-safety — infers literal union types.
   * @example fields.select({ options: ['static', 'overlay'] as const })
   */
  select: <T extends readonly [string, ...string[]]>({ options }: { options: T }) =>
    z.enum(options).describe(encodeFieldMeta('select', { options })),

  /**
   * File field (document/media reference)
   * Stores media ID or URL
   * @example fields.file()
   */
  file: () => z.string().describe(encodeFieldMeta('file')),

  /**
   * URL field (validated URL string)
   * @example fields.url()
   */
  url: () => z.string().url().describe(encodeFieldMeta('url')),
};

/**
 * Adds conditional visibility metadata to a field schema.
 * The field will only be shown in the admin UI when the specified
 * field has one of the given values.
 */
export function visibleWhen<T extends z.ZodTypeAny>(
  schema: T,
  field: string,
  value: string | readonly string[]
): T {
  const meta = getFieldMeta(schema);
  if (!meta) return schema;
  const values = Array.isArray(value) ? [...value] : [value];
  const newMeta: Omit<FieldMeta, 'version' | 'fieldType'> = {};
  if (meta.options) newMeta.options = meta.options;
  if (meta.allowedBlocks) newMeta.allowedBlocks = meta.allowedBlocks;
  newMeta.visibleWhen = { field, values };
  return schema.describe(encodeFieldMeta(meta.fieldType, newMeta)) as T;
}
