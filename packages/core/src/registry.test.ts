import { describe, it, expect } from 'vitest';
import { z } from 'zod';
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

describe('createRegistry', () => {
  it('should create a registry with sections and page types', () => {
    const registry = createRegistry({
      sections: [HeroSection, TextSection],
      pageTypes: ['landing', 'article'],
    });

    expect(registry).toBeDefined();
    expect(registry.getSection).toBeDefined();
    expect(registry.getAllSections).toBeDefined();
    expect(registry.getPageTypes).toBeDefined();
  });

  it('should create a registry without page types', () => {
    const registry = createRegistry({
      sections: [HeroSection],
    });

    expect(registry.getPageTypes()).toEqual([]);
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

describe('registry.getPageTypes', () => {
  it('should return registered page types', () => {
    const registry = createRegistry({
      sections: [HeroSection],
      pageTypes: ['landing', 'article', 'contact'],
    });

    const pageTypes = registry.getPageTypes();
    expect(pageTypes).toEqual(['landing', 'article', 'contact']);
  });

  it('should return a copy of page types array', () => {
    const registry = createRegistry({
      sections: [HeroSection],
      pageTypes: ['landing'],
    });

    const pageTypes1 = registry.getPageTypes();
    const pageTypes2 = registry.getPageTypes();

    expect(pageTypes1).not.toBe(pageTypes2);
    expect(pageTypes1).toEqual(pageTypes2);
  });
});
