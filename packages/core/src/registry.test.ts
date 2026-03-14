import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { defineNavigation } from './define-navigation';
import { definePageType } from './define-page-type';
import { defineSection } from './define-section';
import { createRegistry } from './registry';

const HeroSection = defineSection({
  name: 'hero',
  fields: {
    title: z.string(),
    subtitle: z.string().optional(),
  },
});

const TextSection = defineSection({
  name: 'text',
  fields: {
    content: z.string(),
  },
});

const GallerySection = defineSection({
  name: 'gallery',
  fields: {
    images: z.array(z.string()),
  },
});

const LandingPage = definePageType({
  name: 'landing',
  allowedSections: ['hero', 'text'],
});

const ArticlePage = definePageType({
  name: 'article',
  allowedSections: ['text'],
});

const MainNav = defineNavigation({
  name: 'main',
});

const FooterNav = defineNavigation({
  name: 'footer',
});

describe('createRegistry', () => {
  it('should create a registry with sections and page types', () => {
    const registry = createRegistry({
      sections: [HeroSection, TextSection],
      pageTypes: [LandingPage, ArticlePage],
    });

    expect(registry).toBeDefined();
    expect(registry.getSection).toBeDefined();
    expect(registry.getAllSections).toBeDefined();
    expect(registry.getPageType).toBeDefined();
    expect(registry.getAllPageTypes).toBeDefined();
  });

  it('should create a registry without page types', () => {
    const registry = createRegistry({
      sections: [HeroSection],
    });

    expect(registry.getAllPageTypes()).toEqual([]);
  });
});

describe('registry.getSection', () => {
  it('should return section definition by name', () => {
    const registry = createRegistry({
      sections: [HeroSection, TextSection, GallerySection],
    });

    const hero = registry.getSection('hero');
    expect(hero).toBeDefined();
    expect(hero?.name).toBe('hero');
    expect(hero?.schema).toBeDefined();
  });

  it('should return undefined for non-existent section', () => {
    const registry = createRegistry({
      sections: [HeroSection],
    });

    const result = registry.getSection('non-existent');
    expect(result).toBeUndefined();
  });
});

describe('registry.getAllSections', () => {
  it('should return all registered sections', () => {
    const registry = createRegistry({
      sections: [HeroSection, TextSection, GallerySection],
    });

    const sections = registry.getAllSections();
    expect(sections).toHaveLength(3);
    expect(sections.map((s) => s.name)).toContain('hero');
    expect(sections.map((s) => s.name)).toContain('text');
    expect(sections.map((s) => s.name)).toContain('gallery');
  });

  it('should return empty array for empty registry', () => {
    const registry = createRegistry({
      sections: [],
    });

    expect(registry.getAllSections()).toEqual([]);
  });
});

describe('registry duplicate detection', () => {
  it('should throw error for duplicate section names', () => {
    const DuplicateSection = defineSection({
      name: 'hero',
      fields: { different: z.string() },
    });

    expect(() => {
      createRegistry({
        sections: [HeroSection, DuplicateSection],
      });
    }).toThrow('Duplicate section name: "hero". Each section must have a unique name.');
  });

  it('should throw error for duplicate page type names', () => {
    const DuplicatePage = definePageType({
      name: 'landing',
      allowedSections: ['different'],
    });

    expect(() => {
      createRegistry({
        sections: [HeroSection],
        pageTypes: [LandingPage, DuplicatePage],
      });
    }).toThrow('Duplicate page type name: "landing". Each page type must have a unique name.');
  });

  it('should throw error for duplicate navigation names', () => {
    const DuplicateNav = defineNavigation({
      name: 'main',
    });

    expect(() => {
      createRegistry({
        sections: [HeroSection],
        navigations: [MainNav, DuplicateNav],
      });
    }).toThrow('Duplicate navigation name: "main". Each navigation must have a unique name.');
  });
});

describe('registry immutability', () => {
  it('should return frozen section objects', () => {
    const registry = createRegistry({
      sections: [HeroSection],
    });

    const section = registry.getSection('hero');
    expect(section).toBeDefined();
    expect(Object.isFrozen(section)).toBe(true);
  });

  it('should prevent mutation of returned section', () => {
    const registry = createRegistry({
      sections: [HeroSection],
    });

    const section = registry.getSection('hero');
    expect(() => {
      if (section) {
        // @ts-expect-error - testing immutability
        section.name = 'mutated';
      }
    }).toThrow();
  });

  it('should return frozen page type objects', () => {
    const registry = createRegistry({
      sections: [HeroSection],
      pageTypes: [LandingPage],
    });

    const pageType = registry.getPageType('landing');
    expect(pageType).toBeDefined();
    expect(Object.isFrozen(pageType)).toBe(true);
  });

  it('should prevent mutation of returned page type', () => {
    const registry = createRegistry({
      sections: [HeroSection],
      pageTypes: [LandingPage],
    });

    const pageType = registry.getPageType('landing');
    expect(() => {
      if (pageType) {
        // @ts-expect-error - testing immutability
        pageType.name = 'mutated';
      }
    }).toThrow();
  });

  it('should return frozen navigation objects', () => {
    const registry = createRegistry({
      sections: [HeroSection],
      navigations: [MainNav],
    });

    const navigation = registry.getNavigation('main');
    expect(navigation).toBeDefined();
    expect(Object.isFrozen(navigation)).toBe(true);
  });

  it('should prevent mutation of returned navigation', () => {
    const registry = createRegistry({
      sections: [HeroSection],
      navigations: [MainNav],
    });

    const navigation = registry.getNavigation('main');
    expect(() => {
      if (navigation) {
        // @ts-expect-error - testing immutability
        navigation.name = 'mutated';
      }
    }).toThrow();
  });
});
