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
    if (sectionMap.has(section.name)) {
      throw new Error(
        `Duplicate section name: "${section.name}". Each section must have a unique name.`
      );
    }
    sectionMap.set(section.name, section);
  }

  for (const pageType of config.pageTypes ?? []) {
    if (pageTypeMap.has(pageType.name)) {
      throw new Error(
        `Duplicate page type name: "${pageType.name}". Each page type must have a unique name.`
      );
    }
    pageTypeMap.set(pageType.name, pageType);
  }

  for (const navigation of config.navigations ?? []) {
    if (navigationMap.has(navigation.name)) {
      throw new Error(
        `Duplicate navigation name: "${navigation.name}". Each navigation must have a unique name.`
      );
    }
    navigationMap.set(navigation.name, navigation);
  }

  return {
    getSection(name: string): SectionDefinition<z.ZodRawShape> | undefined {
      const section = sectionMap.get(name);
      return section ? Object.freeze({ ...section }) : undefined;
    },

    getAllSections(): Array<SectionDefinition<z.ZodRawShape>> {
      return Array.from(sectionMap.values());
    },

    getPageType(name: string): PageTypeDefinition | undefined {
      const pageType = pageTypeMap.get(name);
      return pageType ? Object.freeze({ ...pageType }) : undefined;
    },

    getAllPageTypes(): PageTypeDefinition[] {
      return Array.from(pageTypeMap.values());
    },

    getNavigation(name: string): NavigationDefinition | undefined {
      const navigation = navigationMap.get(name);
      return navigation ? Object.freeze({ ...navigation }) : undefined;
    },

    getAllNavigations(): NavigationDefinition[] {
      return Array.from(navigationMap.values());
    },
  };
}
