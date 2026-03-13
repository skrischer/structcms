import { describe, expect, it } from 'vitest';
import type { MediaAdapter } from '../media/types';
import type { Page, StorageAdapter } from '../storage/types';
import {
  handleExportAllPages,
  handleExportNavigations,
  handleExportPage,
  handleExportSite,
} from './handlers';

const testDate = new Date('2025-01-15T10:00:00Z');
const mediaId = '11111111-1111-1111-1111-111111111111';

function createMockStorageAdapter(pages: Record<string, Page>): StorageAdapter {
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

function createMockMediaAdapter(mediaMap: Record<string, string>): MediaAdapter {
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
    const result = await handleExportPage(storageAdapter, mediaAdapter, 'home');

    expect(result).not.toBeNull();
    expect(result?.data.id).toBe('page-1');
    expect(result?.data.slug).toBe('home');
    expect(result?.data.pageType).toBe('landing');
    expect(result?.data.title).toBe('Home Page');
    expect(result?.data.sections).toHaveLength(2);
  });

  it('should resolve media references to URLs', async () => {
    const result = await handleExportPage(storageAdapter, mediaAdapter, 'home');

    expect(result?.data.sections[0].data.image).toBe('https://cdn.example.com/hero.jpg');
    expect(result?.data.sections[1].data.body).toBe('Hello world');
  });

  it('should serialize dates as ISO strings', async () => {
    const result = await handleExportPage(storageAdapter, mediaAdapter, 'home');

    expect(result?.data.createdAt).toBe('2025-01-15T10:00:00.000Z');
    expect(result?.data.updatedAt).toBe('2025-01-15T10:00:00.000Z');
  });

  it('should include Content-Disposition header value', async () => {
    const result = await handleExportPage(storageAdapter, mediaAdapter, 'home');

    expect(result?.contentDisposition).toBe('attachment; filename="home.json"');
  });

  it('should return null for non-existent page', async () => {
    const result = await handleExportPage(storageAdapter, mediaAdapter, 'non-existent');

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

    expect(result?.data.sections[0].data.image).toBeNull();
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
      sections: [{ id: 'hero-1', type: 'hero', data: { image: mediaId } }],
      createdAt: testDate,
      updatedAt: testDate,
    },
    about: {
      id: 'page-2',
      slug: 'about',
      pageType: 'content',
      title: 'About Page',
      sections: [{ id: 'banner-1', type: 'banner', data: { thumbnail: mediaId2 } }],
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

    expect(homePage?.sections[0].data.image).toBe('https://cdn.example.com/hero.jpg');
    expect(aboutPage?.sections[0].data.thumbnail).toBe('https://cdn.example.com/about.png');
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

    expect(result.contentDisposition).toBe('attachment; filename="pages-export.json"');
  });

  it('should handle empty pages list', async () => {
    const emptyAdapter = createMockStorageAdapter({});
    const result = await handleExportAllPages(emptyAdapter, mediaAdapter);

    expect(result.data.pages).toHaveLength(0);
    expect(result.data.exportedAt).toBeDefined();
  });
});

describe('handleExportNavigations', () => {
  const navDate = new Date('2025-02-01T12:00:00Z');

  const storageAdapter = createMockStorageAdapter({});
  // Override listNavigations for this test suite
  storageAdapter.listNavigations = async () => [
    {
      id: 'nav-1',
      name: 'main',
      items: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about', children: [{ label: 'Team', href: '/about/team' }] },
      ],
      updatedAt: navDate,
    },
    {
      id: 'nav-2',
      name: 'footer',
      items: [{ label: 'Privacy', href: '/privacy' }],
      updatedAt: navDate,
    },
  ];

  it('should return array of all navigations', async () => {
    const result = await handleExportNavigations(storageAdapter);

    expect(result.data.navigations).toHaveLength(2);
    expect(result.data.navigations[0].name).toBe('main');
    expect(result.data.navigations[1].name).toBe('footer');
  });

  it('should include navigation items with nested children', async () => {
    const result = await handleExportNavigations(storageAdapter);

    const mainNav = result.data.navigations[0];
    expect(mainNav.items).toHaveLength(2);
    expect(mainNav.items[1].children).toHaveLength(1);
    expect(mainNav.items[1].children?.[0].label).toBe('Team');
  });

  it('should serialize dates as ISO strings', async () => {
    const result = await handleExportNavigations(storageAdapter);

    expect(result.data.navigations[0].updatedAt).toBe('2025-02-01T12:00:00.000Z');
  });

  it('should include exportedAt timestamp', async () => {
    const before = new Date().toISOString();
    const result = await handleExportNavigations(storageAdapter);
    const after = new Date().toISOString();

    expect(result.data.exportedAt >= before).toBe(true);
    expect(result.data.exportedAt <= after).toBe(true);
  });

  it('should include Content-Disposition header', async () => {
    const result = await handleExportNavigations(storageAdapter);

    expect(result.contentDisposition).toBe('attachment; filename="navigation-export.json"');
  });

  it('should handle empty navigations list', async () => {
    const emptyAdapter = createMockStorageAdapter({});
    const result = await handleExportNavigations(emptyAdapter);

    expect(result.data.navigations).toHaveLength(0);
    expect(result.data.exportedAt).toBeDefined();
  });
});

describe('handleExportSite', () => {
  const mediaId2 = '22222222-2222-2222-2222-222222222222';
  const siteDate = new Date('2025-03-01T08:00:00Z');

  const pages: Record<string, Page> = {
    home: {
      id: 'page-1',
      slug: 'home',
      pageType: 'landing',
      title: 'Home',
      sections: [{ id: 'hero-1', type: 'hero', data: { image: mediaId } }],
      createdAt: testDate,
      updatedAt: testDate,
    },
  };

  const storageAdapter = createMockStorageAdapter(pages);
  storageAdapter.listNavigations = async () => [
    {
      id: 'nav-1',
      name: 'main',
      items: [{ label: 'Home', href: '/' }],
      updatedAt: siteDate,
    },
  ];

  const mediaAdapter = createMockMediaAdapter({
    [mediaId]: 'https://cdn.example.com/hero.jpg',
    [mediaId2]: 'https://cdn.example.com/about.png',
  });
  // Override listMedia to return media entries
  mediaAdapter.listMedia = async () => [
    {
      id: mediaId,
      filename: 'hero.jpg',
      url: 'https://cdn.example.com/hero.jpg',
      mimeType: 'image/jpeg',
      size: 2048,
      createdAt: testDate,
    },
    {
      id: mediaId2,
      filename: 'about.png',
      url: 'https://cdn.example.com/about.png',
      mimeType: 'image/png',
      size: 4096,
      createdAt: testDate,
    },
  ];

  it('should return pages, navigations, and media', async () => {
    const result = await handleExportSite(storageAdapter, mediaAdapter);

    expect(result.data.pages).toHaveLength(1);
    expect(result.data.navigations).toHaveLength(1);
    expect(result.data.media).toHaveLength(2);
  });

  it('should resolve media references in pages', async () => {
    const result = await handleExportSite(storageAdapter, mediaAdapter);

    expect(result.data.pages[0].sections[0].data.image).toBe('https://cdn.example.com/hero.jpg');
  });

  it('should include media URLs for external download', async () => {
    const result = await handleExportSite(storageAdapter, mediaAdapter);

    expect(result.data.media[0].url).toBe('https://cdn.example.com/hero.jpg');
    expect(result.data.media[0].filename).toBe('hero.jpg');
    expect(result.data.media[0].mimeType).toBe('image/jpeg');
    expect(result.data.media[0].size).toBe(2048);
    expect(result.data.media[1].url).toBe('https://cdn.example.com/about.png');
  });

  it('should serialize all dates as ISO strings', async () => {
    const result = await handleExportSite(storageAdapter, mediaAdapter);

    expect(result.data.pages[0].createdAt).toBe('2025-01-15T10:00:00.000Z');
    expect(result.data.navigations[0].updatedAt).toBe('2025-03-01T08:00:00.000Z');
    expect(result.data.media[0].createdAt).toBe('2025-01-15T10:00:00.000Z');
  });

  it('should include exportedAt timestamp', async () => {
    const before = new Date().toISOString();
    const result = await handleExportSite(storageAdapter, mediaAdapter);
    const after = new Date().toISOString();

    expect(result.data.exportedAt >= before).toBe(true);
    expect(result.data.exportedAt <= after).toBe(true);
  });

  it('should include Content-Disposition header', async () => {
    const result = await handleExportSite(storageAdapter, mediaAdapter);

    expect(result.contentDisposition).toBe('attachment; filename="site-export.json"');
  });

  it('should handle empty site', async () => {
    const emptyStorage = createMockStorageAdapter({});
    const emptyMedia = createMockMediaAdapter({});
    const result = await handleExportSite(emptyStorage, emptyMedia);

    expect(result.data.pages).toHaveLength(0);
    expect(result.data.navigations).toHaveLength(0);
    expect(result.data.media).toHaveLength(0);
    expect(result.data.exportedAt).toBeDefined();
  });
});
