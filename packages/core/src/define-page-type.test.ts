import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { definePageType } from './define-page-type';
import { defineSection } from './define-section';
import { createRegistry } from './registry';

const HeroSection = defineSection({
  name: 'hero',
  fields: { title: z.string() },
});

const TextSection = defineSection({
  name: 'text',
  fields: { content: z.string() },
});

const GallerySection = defineSection({
  name: 'gallery',
  fields: { images: z.array(z.string()) },
});

describe('definePageType', () => {
  it('should create a page type definition with name and allowed sections', () => {
    const LandingPage = definePageType({
      name: 'landing',
      allowedSections: ['hero', 'text', 'gallery'],
    });

    expect(LandingPage.name).toBe('landing');
    expect(LandingPage.allowedSections).toEqual(['hero', 'text', 'gallery']);
  });

  it('should create a copy of allowedSections array', () => {
    const sections = ['hero', 'text'];
    const PageType = definePageType({
      name: 'test',
      allowedSections: sections,
    });

    sections.push('gallery');
    expect(PageType.allowedSections).toEqual(['hero', 'text']);
  });
});

describe('registry.getPageType', () => {
  it('should return page type definition by name', () => {
    const LandingPage = definePageType({
      name: 'landing',
      allowedSections: ['hero', 'text'],
    });

    const ArticlePage = definePageType({
      name: 'article',
      allowedSections: ['text'],
    });

    const registry = createRegistry({
      sections: [HeroSection, TextSection],
      pageTypes: [LandingPage, ArticlePage],
    });

    const landing = registry.getPageType('landing');
    expect(landing).toBeDefined();
    expect(landing?.name).toBe('landing');
    expect(landing?.allowedSections).toEqual(['hero', 'text']);
  });

  it('should return undefined for non-existent page type', () => {
    const registry = createRegistry({
      sections: [HeroSection],
      pageTypes: [],
    });

    expect(registry.getPageType('non-existent')).toBeUndefined();
  });
});

describe('registry.getAllPageTypes', () => {
  it('should return all registered page types', () => {
    const LandingPage = definePageType({
      name: 'landing',
      allowedSections: ['hero', 'text'],
    });

    const ArticlePage = definePageType({
      name: 'article',
      allowedSections: ['text'],
    });

    const registry = createRegistry({
      sections: [HeroSection, TextSection],
      pageTypes: [LandingPage, ArticlePage],
    });

    const pageTypes = registry.getAllPageTypes();
    expect(pageTypes).toHaveLength(2);
    expect(pageTypes.map((pt) => pt.name)).toContain('landing');
    expect(pageTypes.map((pt) => pt.name)).toContain('article');
  });

  it('should return empty array when no page types registered', () => {
    const registry = createRegistry({
      sections: [HeroSection],
    });

    expect(registry.getAllPageTypes()).toEqual([]);
  });
});

describe('page type section restrictions', () => {
  it('should allow checking if section is allowed for page type', () => {
    const LandingPage = definePageType({
      name: 'landing',
      allowedSections: ['hero', 'text'],
    });

    const registry = createRegistry({
      sections: [HeroSection, TextSection, GallerySection],
      pageTypes: [LandingPage],
    });

    const landing = registry.getPageType('landing');
    expect(landing?.allowedSections.includes('hero')).toBe(true);
    expect(landing?.allowedSections.includes('text')).toBe(true);
    expect(landing?.allowedSections.includes('gallery')).toBe(false);
  });
});
