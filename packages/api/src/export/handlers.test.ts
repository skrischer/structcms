import { describe, it, expect } from 'vitest';
import { handleExportPage, handleExportAllPages } from './handlers';
import type { StorageAdapter, Page } from '../storage/types';
import type { MediaAdapter } from '../media/types';

const testDate = new Date('2025-01-15T10:00:00Z');
const mediaId = '11111111-1111-1111-1111-111111111111';

function createMockStorageAdapter(
  pages: Record<string, Page>
): StorageAdapter {
  return {
    getPage: async (slug: string) => pages[slug] ?? null,
    getPageById: async () => null,
    createPage: async () => {
      throw new Error('Not implemented');
    },
    updatePage: async () => {
      throw new Error('Not implemented');
    },
    deletePage: async () => {},
    listPages: async () => Object.values(pages),
    getNavigation: async () => null,
    getNavigationById: async () => null,
    createNavigation: async () => {
      throw new Error('Not implemented');
    },
    updateNavigation: async () => {
      throw new Error('Not implemented');
    },
    deleteNavigation: async () => {},
    listNavigations: async () => [],
  };
}

function createMockMediaAdapter(
  mediaMap: Record<string, string>
): MediaAdapter {
  return {
    upload: async () => {
      throw new Error('Not implemented');
    },
    getMedia: async (id: string) => {
      const url = mediaMap[id];
      if (!url) return null;
      return {
        id,
        filename: `${id}.jpg`,
        url,
        mimeType: 'image/jpeg',
        size: 1024,
        createdAt: new Date(),
      };
    },
    listMedia: async () => [],
    deleteMedia: async () => {},
  };
}

describe('handleExportPage', () => {
  const testPage: Page = {
    id: 'page-1',
    slug: 'home',
    pageType: 'landing',
    title: 'Home Page',
    sections: [
      {
        id: 'hero-1',
        type: 'hero',
        data: { title: 'Welcome', image: mediaId },
      },
      {
        id: 'text-1',
        type: 'text',
        data: { body: 'Hello world' },
      },
    ],
    createdAt: testDate,
    updatedAt: testDate,
  };

  const storageAdapter = createMockStorageAdapter({ home: testPage });
  const mediaAdapter = createMockMediaAdapter({
    [mediaId]: 'https://cdn.example.com/hero.jpg',
  });

  it('should return full page data as JSON', async () => {
    const result = await handleExportPage(
      storageAdapter,
      mediaAdapter,
      'home'
    );

    expect(result).not.toBeNull();
    expect(result!.data.id).toBe('page-1');
    expect(result!.data.slug).toBe('home');
    expect(result!.data.pageType).toBe('landing');
    expect(result!.data.title).toBe('Home Page');
    expect(result!.data.sections).toHaveLength(2);
  });

  it('should resolve media references to URLs', async () => {
    const result = await handleExportPage(
      storageAdapter,
      mediaAdapter,
      'home'
    );

    expect(result!.data.sections[0].data.image).toBe(
      'https://cdn.example.com/hero.jpg'
    );
    expect(result!.data.sections[1].data.body).toBe('Hello world');
  });

  it('should serialize dates as ISO strings', async () => {
    const result = await handleExportPage(
      storageAdapter,
      mediaAdapter,
      'home'
    );

    expect(result!.data.createdAt).toBe('2025-01-15T10:00:00.000Z');
    expect(result!.data.updatedAt).toBe('2025-01-15T10:00:00.000Z');
  });

  it('should include Content-Disposition header value', async () => {
    const result = await handleExportPage(
      storageAdapter,
      mediaAdapter,
      'home'
    );

    expect(result!.contentDisposition).toBe(
      'attachment; filename="home.json"'
    );
  });

  it('should return null for non-existent page', async () => {
    const result = await handleExportPage(
      storageAdapter,
      mediaAdapter,
      'non-existent'
    );

    expect(result).toBeNull();
  });

  it('should handle missing media gracefully', async () => {
    const missingMediaId = '99999999-9999-9999-9999-999999999999';
    const pageWithMissing: Page = {
      id: 'page-2',
      slug: 'about',
      pageType: 'content',
      title: 'About',
      sections: [
        {
          id: 'hero-1',
          type: 'hero',
          data: { image: missingMediaId },
        },
      ],
      createdAt: testDate,
      updatedAt: testDate,
    };

    const adapter = createMockStorageAdapter({ about: pageWithMissing });
    const result = await handleExportPage(adapter, mediaAdapter, 'about');

    expect(result!.data.sections[0].data.image).toBeNull();
  });
});

describe('handleExportAllPages', () => {
  const mediaId2 = '22222222-2222-2222-2222-222222222222';

  const pages: Record<string, Page> = {
    home: {
      id: 'page-1',
      slug: 'home',
      pageType: 'landing',
      title: 'Home Page',
      sections: [
        { id: 'hero-1', type: 'hero', data: { image: mediaId } },
      ],
      createdAt: testDate,
      updatedAt: testDate,
    },
    about: {
      id: 'page-2',
      slug: 'about',
      pageType: 'content',
      title: 'About Page',
      sections: [
        { id: 'banner-1', type: 'banner', data: { thumbnail: mediaId2 } },
      ],
      createdAt: testDate,
      updatedAt: testDate,
    },
  };

  const storageAdapter = createMockStorageAdapter(pages);
  const mediaAdapter = createMockMediaAdapter({
    [mediaId]: 'https://cdn.example.com/hero.jpg',
    [mediaId2]: 'https://cdn.example.com/about.png',
  });

  it('should return array of all pages', async () => {
    const result = await handleExportAllPages(storageAdapter, mediaAdapter);

    expect(result.data.pages).toHaveLength(2);
    expect(result.data.pages[0].slug).toBeDefined();
    expect(result.data.pages[1].slug).toBeDefined();
  });

  it('should resolve media references in all pages', async () => {
    const result = await handleExportAllPages(storageAdapter, mediaAdapter);

    const homePage = result.data.pages.find((p) => p.slug === 'home');
    const aboutPage = result.data.pages.find((p) => p.slug === 'about');

    expect(homePage!.sections[0].data.image).toBe(
      'https://cdn.example.com/hero.jpg'
    );
    expect(aboutPage!.sections[0].data.thumbnail).toBe(
      'https://cdn.example.com/about.png'
    );
  });

  it('should include exportedAt timestamp', async () => {
    const before = new Date().toISOString();
    const result = await handleExportAllPages(storageAdapter, mediaAdapter);
    const after = new Date().toISOString();

    expect(result.data.exportedAt >= before).toBe(true);
    expect(result.data.exportedAt <= after).toBe(true);
  });

  it('should include Content-Disposition header', async () => {
    const result = await handleExportAllPages(storageAdapter, mediaAdapter);

    expect(result.contentDisposition).toBe(
      'attachment; filename="pages-export.json"'
    );
  });

  it('should handle empty pages list', async () => {
    const emptyAdapter = createMockStorageAdapter({});
    const result = await handleExportAllPages(emptyAdapter, mediaAdapter);

    expect(result.data.pages).toHaveLength(0);
    expect(result.data.exportedAt).toBeDefined();
  });
});
