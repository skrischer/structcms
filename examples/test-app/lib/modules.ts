import { fields } from '@structcms/core';

/**
 * Reusable button field group for CTA patterns.
 * Demonstrates the object field type with nested typed sub-fields.
 */
export function buttonFields() {
  return fields.object({
    label: fields.string().min(1),
    url: fields.url(),
    variant: fields.select({
      options: ['primary', 'secondary', 'outline', 'ghost'] as const,
    }),
    target: fields.select({ options: ['_self', '_blank'] as const }),
  });
}
