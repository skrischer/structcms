import type { z } from 'zod';
import type {
  CreateRegistryConfig,
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
 *   pageTypes: ['landing', 'article', 'contact'],
 * });
 *
 * const hero = registry.getSection('hero');
 * const allSections = registry.getAllSections();
 * const pageTypes = registry.getPageTypes();
 */
export function createRegistry(config: CreateRegistryConfig): Registry {
  const sectionMap = new Map<string, SectionDefinition<z.ZodRawShape>>();

  for (const section of config.sections) {
    sectionMap.set(section.name, section);
  }

  const pageTypes = config.pageTypes ?? [];

  return {
    getSection(name: string): SectionDefinition<z.ZodRawShape> | undefined {
      return sectionMap.get(name);
    },

    getAllSections(): Array<SectionDefinition<z.ZodRawShape>> {
      return Array.from(sectionMap.values());
    },

    getPageTypes(): string[] {
      return [...pageTypes];
    },
  };
}
