import type { z } from 'zod';

/**
 * Supported field types for CMS content
 */
export type FieldType =
  | 'string'
  | 'text'
  | 'richtext'
  | 'image'
  | 'reference'
  | 'array'
  | 'object';

/**
 * Metadata stored in Zod schema description for field type identification
 */
export interface FieldMeta {
  fieldType: FieldType;
}

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

/**
 * Utility type to extract the data type from a SectionDefinition
 * @example
 * const HeroSection = defineSection({ name: 'hero', fields: { title: z.string() } });
 * type HeroData = InferSectionData<typeof HeroSection>; // { title: string }
 */
export type InferSectionData<T extends SectionDefinition<z.ZodRawShape>> =
  T['_type'];

/**
 * Configuration for defining a page type
 */
export interface DefinePageTypeConfig {
  name: string;
  allowedSections: string[];
}

/**
 * A page type definition specifying which sections are allowed
 */
export interface PageTypeDefinition {
  name: string;
  allowedSections: string[];
}

/**
 * Configuration for defining a navigation
 */
export interface DefineNavigationConfig<T extends z.ZodTypeAny> {
  name: string;
  schema?: T;
}

/**
 * A navigation definition with typed items
 */
export interface NavigationDefinition<T extends z.ZodTypeAny = z.ZodTypeAny> {
  name: string;
  schema: T;
  _itemType: z.infer<T>;
}

/**
 * Configuration for creating a registry
 */
export interface CreateRegistryConfig {
  sections: Array<SectionDefinition<z.ZodRawShape>>;
  pageTypes?: PageTypeDefinition[];
  navigations?: Array<NavigationDefinition>;
}

/**
 * Registry instance providing access to registered models
 */
export interface Registry {
  getSection(name: string): SectionDefinition<z.ZodRawShape> | undefined;
  getAllSections(): Array<SectionDefinition<z.ZodRawShape>>;
  getPageType(name: string): PageTypeDefinition | undefined;
  getAllPageTypes(): PageTypeDefinition[];
  getNavigation(name: string): NavigationDefinition | undefined;
  getAllNavigations(): NavigationDefinition[];
}

/**
 * Section data as stored/delivered by the CMS
 */
export interface SectionData {
  type: string;
  data: Record<string, unknown>;
}

/**
 * Props passed to section components
 */
export interface SectionComponentProps<T = Record<string, unknown>> {
  data: T;
  sectionKey: string | number;
}

/**
 * A component that renders a section (framework-agnostic)
 */
export type SectionComponent<T = Record<string, unknown>, R = unknown> = (
  props: SectionComponentProps<T>
) => R;

/**
 * Mapping of section type names to their components
 */
export type SectionComponentMap<R = unknown> = Record<
  string,
  SectionComponent<Record<string, unknown>, R>
>;

/**
 * Configuration for createSectionRenderer
 */
export interface CreateSectionRendererConfig<R = unknown> {
  components: SectionComponentMap<R>;
  fallback?: SectionComponent<Record<string, unknown>, R>;
}

/**
 * A function that renders a section to a component result
 */
export type SectionRenderer<R = unknown> = (
  section: SectionData,
  key: string | number
) => R | null;
