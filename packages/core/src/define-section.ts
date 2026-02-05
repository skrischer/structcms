import { z } from 'zod';
import type { DefineSectionConfig, SectionDefinition } from './types';

/**
 * Defines a section with a name and Zod schema fields.
 * Returns a typed section definition with inferred TypeScript types.
 *
 * @example
 * const HeroSection = defineSection({
 *   name: 'hero',
 *   fields: {
 *     title: z.string().min(1),
 *     subtitle: z.string().optional(),
 *     image: z.string().url(),
 *   },
 * });
 *
 * // Type is inferred: { title: string; subtitle?: string; image: string }
 * type HeroData = typeof HeroSection._type;
 */
export function defineSection<T extends z.ZodRawShape>(
  config: DefineSectionConfig<T>
): SectionDefinition<T> {
  const schema = z.object(config.fields);

  return {
    name: config.name,
    schema,
    _type: undefined as unknown as z.infer<typeof schema>,
  };
}
