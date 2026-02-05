import type { DefinePageTypeConfig, PageTypeDefinition } from './types';

/**
 * Defines a page type that specifies which sections are allowed.
 *
 * @example
 * const LandingPage = definePageType({
 *   name: 'landing',
 *   allowedSections: ['hero', 'text', 'gallery', 'cta'],
 * });
 *
 * const ArticlePage = definePageType({
 *   name: 'article',
 *   allowedSections: ['text', 'image', 'quote'],
 * });
 */
export function definePageType(config: DefinePageTypeConfig): PageTypeDefinition {
  return {
    name: config.name,
    allowedSections: [...config.allowedSections],
  };
}
