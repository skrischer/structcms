import type { z } from 'zod';

/**
 * Configuration for defining a section
 */
export interface DefineSectionConfig<T extends z.ZodRawShape> {
  name: string;
  fields: T;
}

/**
 * A section definition with inferred types from Zod schema
 */
export interface SectionDefinition<T extends z.ZodRawShape> {
  name: string;
  schema: z.ZodObject<T>;
  _type: z.infer<z.ZodObject<T>>;
}
