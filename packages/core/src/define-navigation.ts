import { z } from 'zod';
import type { DefineNavigationConfig, NavigationDefinition } from './types';

/**
 * Default navigation item schema with label, href, and optional children
 */
const defaultNavigationItemSchema: z.ZodType<NavigationItem> = z.lazy(() =>
  z.object({
    label: z.string(),
    href: z.string(),
    children: z.array(defaultNavigationItemSchema).optional(),
  })
);

/**
 * Type for the default navigation item
 */
export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

/**
 * Defines a navigation structure with typed items.
 *
 * @example
 * // Using default schema (label, href, children)
 * const MainNav = defineNavigation({ name: 'main' });
 *
 * // Using custom schema
 * const FooterNav = defineNavigation({
 *   name: 'footer',
 *   schema: z.object({
 *     label: z.string(),
 *     href: z.string(),
 *     icon: z.string().optional(),
 *   }),
 * });
 */
export function defineNavigation<T extends z.ZodTypeAny>(
  config: DefineNavigationConfig<T>
): NavigationDefinition<T>;
export function defineNavigation(
  config: DefineNavigationConfig<z.ZodTypeAny>
): NavigationDefinition<typeof defaultNavigationItemSchema>;
export function defineNavigation<T extends z.ZodTypeAny>(
  config: DefineNavigationConfig<T>
): NavigationDefinition<T | typeof defaultNavigationItemSchema> {
  const schema = config.schema ?? defaultNavigationItemSchema;

  return {
    name: config.name,
    schema: schema as T | typeof defaultNavigationItemSchema,
    // TODO: Phantom type — `as unknown as` is required here because _itemType exists only
    // for compile-time type inference and is never read at runtime.
    _itemType: undefined as unknown as z.infer<
      T | typeof defaultNavigationItemSchema
    >,
  };
}

export { defaultNavigationItemSchema };
