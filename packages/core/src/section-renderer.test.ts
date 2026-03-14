import { describe, expect, it, vi } from 'vitest';
import { createSectionRenderer } from './section-renderer';
import type { SectionComponentProps, SectionData } from './types';

describe('createSectionRenderer', () => {
  it('creates a render function', () => {
    const renderSection = createSectionRenderer({
      components: {},
    });

    expect(typeof renderSection).toBe('function');
  });

  it('renders matching section type with correct component', () => {
    const heroComponent = (props: SectionComponentProps) => ({
      type: 'hero-rendered',
      data: props.data,
      key: props.sectionKey,
    });

    const renderSection = createSectionRenderer({
      components: {
        hero: heroComponent,
      },
    });

    const section: SectionData = {
      type: 'hero',
      data: { title: 'Hello World' },
    };

    const result = renderSection(section, 0);

    expect(result).toEqual({
      type: 'hero-rendered',
      data: { title: 'Hello World' },
      key: 0,
    });
  });

  it('passes section data and key to component', () => {
    let receivedProps: SectionComponentProps | null = null;

    const textComponent = (props: SectionComponentProps) => {
      receivedProps = props;
      return 'text-result';
    };

    const renderSection = createSectionRenderer({
      components: {
        text: textComponent,
      },
    });

    const section: SectionData = {
      type: 'text',
      data: { content: 'Lorem ipsum', author: 'John' },
    };

    renderSection(section, 'section-42');

    expect(receivedProps).toEqual({
      data: { content: 'Lorem ipsum', author: 'John' },
      sectionKey: 'section-42',
    });
  });

  it('returns null for unknown section type without fallback', () => {
    const renderSection = createSectionRenderer({
      components: {
        hero: () => 'hero',
      },
    });

    const section: SectionData = {
      type: 'unknown-section',
      data: {},
    };

    const result = renderSection(section, 0);

    expect(result).toBeNull();
  });

  it('uses fallback component for unknown section types', () => {
    const fallbackComponent = (props: SectionComponentProps) => ({
      type: 'fallback',
      sectionType: 'unknown',
      key: props.sectionKey,
    });

    const renderSection = createSectionRenderer({
      components: {
        hero: () => ({ type: 'hero', sectionType: 'hero', key: 0 }),
      },
      fallback: fallbackComponent,
    });

    const section: SectionData = {
      type: 'gallery',
      data: { images: [] },
    };

    const result = renderSection(section, 5);

    expect(result).toEqual({
      type: 'fallback',
      sectionType: 'unknown',
      key: 5,
    });
  });

  it('renders multiple different section types', () => {
    const heroComponent = () => 'hero-result';
    const textComponent = () => 'text-result';
    const galleryComponent = () => 'gallery-result';

    const renderSection = createSectionRenderer({
      components: {
        hero: heroComponent,
        text: textComponent,
        gallery: galleryComponent,
      },
    });

    const sections: SectionData[] = [
      { type: 'hero', data: {} },
      { type: 'text', data: {} },
      { type: 'gallery', data: {} },
    ];

    const results = sections.map((section, i) => renderSection(section, i));

    expect(results).toEqual(['hero-result', 'text-result', 'gallery-result']);
  });

  it('works with string keys', () => {
    const component = (props: SectionComponentProps) => props.sectionKey;

    const renderSection = createSectionRenderer({
      components: {
        test: component,
      },
    });

    const result = renderSection({ type: 'test', data: {} }, 'my-unique-key');

    expect(result).toBe('my-unique-key');
  });

  it('works with numeric keys', () => {
    const component = (props: SectionComponentProps) => props.sectionKey;

    const renderSection = createSectionRenderer({
      components: {
        test: component,
      },
    });

    const result = renderSection({ type: 'test', data: {} }, 42);

    expect(result).toBe(42);
  });

  it('component receives data with correct structure', () => {
    const heroComponent = (props: SectionComponentProps) => {
      const data = props.data as {
        title: string;
        subtitle?: string;
        cta: { label: string; href: string };
      };
      return {
        title: data.title,
        hasSubtitle: data.subtitle !== undefined,
        ctaLabel: data.cta.label,
      };
    };

    const renderSection = createSectionRenderer({
      components: {
        hero: heroComponent,
      },
    });

    const section: SectionData = {
      type: 'hero',
      data: {
        title: 'Welcome',
        cta: { label: 'Click me', href: '/action' },
      },
    };

    const result = renderSection(section, 0);

    expect(result).toEqual({
      title: 'Welcome',
      hasSubtitle: false,
      ctaLabel: 'Click me',
    });
  });
});

describe('section renderer error handling', () => {
  it('should catch component errors and return null when no fallback is configured', () => {
    const errorComponent = () => {
      throw new Error('Component rendering failed');
    };

    const renderSection = createSectionRenderer({
      components: {
        error: errorComponent,
      },
    });

    const section: SectionData = {
      type: 'error',
      data: {},
    };

    // Should not throw, but return null
    const result = renderSection(section, 0);
    expect(result).toBeNull();
  });

  it('should use fallback component when main component throws error', () => {
    const errorComponent = () => {
      throw new Error('Component rendering failed');
    };

    const fallbackComponent = (props: SectionComponentProps) => ({
      type: 'fallback-rendered',
      key: props.sectionKey,
    });

    const renderSection = createSectionRenderer({
      components: {
        error: errorComponent,
      },
      fallback: fallbackComponent,
    });

    const section: SectionData = {
      type: 'error',
      data: { test: 'data' },
    };

    const result = renderSection(section, 5);
    expect(result).toEqual({
      type: 'fallback-rendered',
      key: 5,
    });
  });

  it('should log error with section type and index when component fails', () => {
    const errorComponent = () => {
      throw new Error('Rendering failed');
    };

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const renderSection = createSectionRenderer({
      components: {
        hero: errorComponent,
      },
    });

    const section: SectionData = {
      type: 'hero',
      data: {},
    };

    renderSection(section, 42);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error rendering section type "hero" at index 42:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it('should handle string key in error log', () => {
    const errorComponent = () => {
      throw new Error('Rendering failed');
    };

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const renderSection = createSectionRenderer({
      components: {
        text: errorComponent,
      },
    });

    const section: SectionData = {
      type: 'text',
      data: {},
    };

    renderSection(section, 'section-key-123');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error rendering section type "text" at index section-key-123:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it('should not catch errors when no component is found (unknown section type)', () => {
    const renderSection = createSectionRenderer({
      components: {
        hero: () => 'hero',
      },
    });

    const section: SectionData = {
      type: 'unknown',
      data: {},
    };

    const result = renderSection(section, 0);
    expect(result).toBeNull();
  });
});
