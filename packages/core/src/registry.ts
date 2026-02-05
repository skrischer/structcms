import type { z } from 'zod';
import type {
  CreateRegistryConfig,
  NavigationDefinition,
  PageTypeDefinition,
  Registry,
  SectionDefinition,
} from './types';

/**
 * Creates a registry that collects section definitions, page types, and navigations,
 * providing runtime access to registered models.
 *
 * @example
 * const registry = createRegistry({
 *   sections: [HeroSection, TextSection, GallerySection],
 *   pageTypes: [LandingPage, ArticlePage],
 *   navigations: [MainNav, FooterNav],
 * });
 *
 * const hero = registry.getSection('hero');
 * const landing = registry.getPageType('landing');
 * const mainNav = registry.getNavigation('main');
 */
export function createRegistry(config: CreateRegistryConfig): Registry {
  const sectionMap = new Map<string, SectionDefinition<z.ZodRawShape>>();
  const pageTypeMap = new Map<string, PageTypeDefinition>();
  const navigationMap = new Map<string, NavigationDefinition>();

  for (const section of config.sections) {
    sectionMap.set(section.name, section);
  }

  for (const pageType of config.pageTypes ?? []) {
    pageTypeMap.set(pageType.name, pageType);
  }

  for (const navigation of config.navigations ?? []) {
    navigationMap.set(navigation.name, navigation);
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

    getNavigation(name: string): NavigationDefinition | undefined {
      return navigationMap.get(name);
    },

    getAllNavigations(): NavigationDefinition[] {
      return Array.from(navigationMap.values());
    },
  };
}
