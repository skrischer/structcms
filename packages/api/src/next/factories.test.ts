import { describe, expect, it, vi } from 'vitest';
import type { MediaAdapter, MediaFile, UploadMediaInput } from '../media';
import type {
  CreateNavigationInput,
  CreatePageInput,
  Navigation,
  Page,
  StorageAdapter,
  UpdateNavigationInput,
  UpdatePageInput,
} from '../storage';
import {
  createNextMediaByIdRoute,
  createNextMediaRoute,
  createNextNavigationByIdRoute,
  createNextNavigationRoute,
  createNextPageByIdRoute,
  createNextPageBySlugRoute,
  createNextPagesRoute,
} from './factories';

function createPage(overrides: Partial<Page> = {}): Page {
  return {
    id: 'page-1',
    slug: 'home',
    pageType: 'landing',
    title: 'Home',
    sections: [],
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    ...overrides,
  };
}

function createNavigation(overrides: Partial<Navigation> = {}): Navigation {
  return {
    id: 'nav-1',
    name: 'main',
    items: [{ label: 'Home', href: '/' }],
    updatedAt: new Date('2026-01-03T00:00:00.000Z'),
    ...overrides,
  };
}

function createMediaFile(overrides: Partial<MediaFile> = {}): MediaFile {
  return {
    id: 'media-1',
    filename: 'hero.jpg',
    url: 'https://cdn.example.com/hero.jpg',
    mimeType: 'image/jpeg',
    size: 128,
    createdAt: new Date('2026-01-04T00:00:00.000Z'),
    ...overrides,
  };
}

function createStorageAdapterMock(overrides: Partial<StorageAdapter> = {}): StorageAdapter {
  const defaults: StorageAdapter = {
    getPage: async () => null,
    getPageById: async () => null,
    createPage: async (input: CreatePageInput) =>
      createPage({
        slug: input.slug ?? 'generated-slug',
        pageType: input.pageType,
        title: input.title,
        sections: input.sections ?? [],
      }),
    updatePage: async (input: UpdatePageInput) =>
      createPage({ id: input.id, title: input.title ?? 'Updated' }),
    deletePage: async () => {},
    listPages: async () => [],
    getNavigation: async () => null,
    getNavigationById: async () => null,
    createNavigation: async (input: CreateNavigationInput) =>
      createNavigation({ name: input.name, items: input.items }),
    updateNavigation: async (input: UpdateNavigationInput) =>
      createNavigation({ id: input.id, name: input.name ?? 'main', items: input.items ?? [] }),
    deleteNavigation: async () => {},
    listNavigations: async () => [],
  };

  return {
    ...defaults,
    ...overrides,
  };
}

function createMediaAdapterMock(overrides: Partial<MediaAdapter> = {}): MediaAdapter {
  const defaults: MediaAdapter = {
    upload: async (input: UploadMediaInput) =>
      createMediaFile({ filename: input.filename, mimeType: input.mimeType, size: input.size }),
    getMedia: async () => null,
    listMedia: async () => [],
    deleteMedia: async () => {},
  };

  return {
    ...defaults,
    ...overrides,
  };
}

describe('Next preset factories', () => {
  it('createNextPagesRoute returns page list on GET and 500 on error', async () => {
    const listPages = vi
      .fn<StorageAdapter['listPages']>()
      .mockResolvedValue([createPage({ slug: 'landing' })]);

    const okRoute = createNextPagesRoute({
      storageAdapter: createStorageAdapterMock({ listPages }),
    });

    const okResponse = await okRoute.GET(new Request('http://localhost/api/cms/pages'));
    expect(okResponse.status).toBe(200);
    await expect(okResponse.json()).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: 'landing' })])
    );

    const errorRoute = createNextPagesRoute({
      storageAdapter: createStorageAdapterMock({
        listPages: vi.fn<StorageAdapter['listPages']>().mockRejectedValue(new Error('boom')),
      }),
    });

    const errorResponse = await errorRoute.GET(new Request('http://localhost/api/cms/pages'));
    expect(errorResponse.status).toBe(500);
  });

  it('createNextPageBySlugRoute returns 200 for found page and 404 for missing page', async () => {
    const existingPage = createPage({ id: 'page-99', slug: 'blog/post' });

    const route = createNextPageBySlugRoute({
      storageAdapter: createStorageAdapterMock({
        getPage: vi
          .fn<StorageAdapter['getPage']>()
          .mockImplementation(async (slug) => (slug === 'blog/post' ? existingPage : null)),
      }),
    });

    const okResponse = await route.GET(new Request('http://localhost/api/cms/pages/blog/post'), {
      params: { slug: ['blog', 'post'] },
    });
    expect(okResponse.status).toBe(200);

    const missingResponse = await route.GET(new Request('http://localhost/api/cms/pages/unknown'), {
      params: { slug: 'unknown' },
    });
    expect(missingResponse.status).toBe(404);
  });

  it('createNextPageByIdRoute returns 200 for found page and 404 for missing page', async () => {
    const route = createNextPageByIdRoute({
      storageAdapter: createStorageAdapterMock({
        getPageById: vi
          .fn<StorageAdapter['getPageById']>()
          .mockImplementation(async (id) => (id === 'page-1' ? createPage() : null)),
      }),
    });

    const okResponse = await route.GET(new Request('http://localhost/api/cms/pages/page-1'), {
      params: { id: 'page-1' },
    });
    expect(okResponse.status).toBe(200);

    const missingResponse = await route.GET(new Request('http://localhost/api/cms/pages/page-x'), {
      params: { id: 'page-x' },
    });
    expect(missingResponse.status).toBe(404);
  });

  it('createNextMediaRoute returns media list on GET and 400 for missing file on POST', async () => {
    const route = createNextMediaRoute({
      mediaAdapter: createMediaAdapterMock({
        listMedia: vi
          .fn<MediaAdapter['listMedia']>()
          .mockResolvedValue([createMediaFile({ id: 'media-22' })]),
      }),
    });

    const getResponse = await route.GET(new Request('http://localhost/api/cms/media'));
    expect(getResponse.status).toBe(200);
    await expect(getResponse.json()).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'media-22' })])
    );

    const postResponse = await route.POST(
      new Request('http://localhost/api/cms/media', {
        method: 'POST',
        body: new FormData(),
      })
    );
    expect(postResponse.status).toBe(400);
  });

  it('createNextMediaByIdRoute returns 200 for found media and 404 for missing media', async () => {
    const route = createNextMediaByIdRoute({
      mediaAdapter: createMediaAdapterMock({
        getMedia: vi
          .fn<MediaAdapter['getMedia']>()
          .mockImplementation(async (id) => (id === 'media-1' ? createMediaFile() : null)),
      }),
    });

    const okResponse = await route.GET(new Request('http://localhost/api/cms/media/media-1'), {
      params: { id: 'media-1' },
    });
    expect(okResponse.status).toBe(200);

    const missingResponse = await route.GET(new Request('http://localhost/api/cms/media/media-x'), {
      params: { id: 'media-x' },
    });
    expect(missingResponse.status).toBe(404);
  });

  it('createNextNavigationRoute returns navigation list on GET and 500 on error', async () => {
    const okRoute = createNextNavigationRoute({
      storageAdapter: createStorageAdapterMock({
        listNavigations: vi
          .fn<StorageAdapter['listNavigations']>()
          .mockResolvedValue([createNavigation({ id: 'nav-20' })]),
      }),
    });

    const okResponse = await okRoute.GET(new Request('http://localhost/api/cms/navigation'));
    expect(okResponse.status).toBe(200);

    const errorRoute = createNextNavigationRoute({
      storageAdapter: createStorageAdapterMock({
        listNavigations: vi
          .fn<StorageAdapter['listNavigations']>()
          .mockRejectedValue(new Error('navigation-fail')),
      }),
    });

    const errorResponse = await errorRoute.GET(new Request('http://localhost/api/cms/navigation'));
    expect(errorResponse.status).toBe(500);
  });

  it('createNextNavigationByIdRoute returns 200 for found navigation and 404 for missing navigation', async () => {
    const route = createNextNavigationByIdRoute({
      storageAdapter: createStorageAdapterMock({
        getNavigationById: vi
          .fn<StorageAdapter['getNavigationById']>()
          .mockImplementation(async (id) =>
            id === 'nav-1' ? createNavigation({ id: 'nav-1' }) : null
          ),
      }),
    });

    const okResponse = await route.GET(new Request('http://localhost/api/cms/navigation/nav-1'), {
      params: { id: 'nav-1' },
    });
    expect(okResponse.status).toBe(200);

    const missingResponse = await route.GET(
      new Request('http://localhost/api/cms/navigation/nav-x'),
      {
        params: { id: 'nav-x' },
      }
    );
    expect(missingResponse.status).toBe(404);
  });
});
