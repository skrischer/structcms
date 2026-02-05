import type { z } from 'zod';
import type {
  CreateRegistryConfig,
  PageTypeDefinition,
  Registry,
  SectionDefinition,
} from './types';

/**
 * Creates a registry that collects section definitions and page types,
 * providing runtime access to registered models.
 *
 * @example
 * const registry = createRegistry({
 *   sections: [HeroSection, TextSection, GallerySection],
 *   pageTypes: [LandingPage, ArticlePage],
 * });
 *
 * const hero = registry.getSection('hero');
 * const allSections = registry.getAllSections();
 * const landing = registry.getPageType('landing');
 */
export function createRegistry(config: CreateRegistryConfig): Registry {
  const sectionMap = new Map<string, SectionDefinition<z.ZodRawShape>>();
  const pageTypeMap = new Map<string, PageTypeDefinition>();

  for (const section of config.sections) {
    sectionMap.set(section.name, section);
  }

  for (const pageType of config.pageTypes ?? []) {
    pageTypeMap.set(pageType.name, pageType);
  }

  return {
    getSection(name: string): SectionDefinition<z.ZodRawShape> | undefined {
      return sectionMap.get(name);
    },

    getAllSections(): Array<SectionDefinition<z.ZodRawShape>> {
      return Array.from(sectionMap.values());
    },

    getPageType(name: string): PageTypeDefinition | undefined {
      return pageTypeMap.get(name);
    },

    getAllPageTypes(): PageTypeDefinition[] {
      return Array.from(pageTypeMap.values());
    },
  };
}
