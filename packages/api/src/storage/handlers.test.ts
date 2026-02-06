import { describe, it, expect } from 'vitest';
import { handleCreatePage, handleUpdatePage, handleDeletePage, StorageValidationError } from './handlers';
import type { StorageAdapter, Page, CreatePageInput, UpdatePageInput } from './types';

const testDate = new Date('2025-01-15T10:00:00Z');

function createMockStorageAdapter(
  pages: Record<string, Page>
): StorageAdapter {
  return {
    getPage: async (slug: string) => pages[slug] ?? null,
    getPageById: async (id: string) =>
      Object.values(pages).find((p) => p.id === id) ?? null,
    createPage: async (input: CreatePageInput) => ({
      id: 'new-page-id',
      slug: input.slug ?? 'generated-slug',
      pageType: input.pageType,
      title: input.title,
      sections: input.sections ?? [],
      createdAt: testDate,
      updatedAt: testDate,
    }),
    updatePage: async (input: UpdatePageInput) => {
      const existing = Object.values(pages).find((p) => p.id === input.id);
      if (!existing) {
        throw new Error('Page not found');
      }
      return {
        ...existing,
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.slug !== undefined ? { slug: input.slug } : {}),
        ...(input.pageType !== undefined ? { pageType: input.pageType } : {}),
        ...(input.sections !== undefined ? { sections: input.sections } : {}),
        updatedAt: testDate,
      };
    },
    deletePage: async () => {},
    listPages: async () => Object.values(pages),
    getNavigation: async () => null,
    getNavigationById: async () => null,
    createNavigation: async () => ({
      id: 'nav-id',
      name: 'main',
      items: [],
      updatedAt: testDate,
    }),
    updateNavigation: async () => ({
      id: 'nav-id',
      name: 'main',
      items: [],
      updatedAt: testDate,
    }),
    deleteNavigation: async () => {},
    listNavigations: async () => [],
  };
}

describe('handleCreatePage', () => {
  it('should create a page with generated slug from title', async () => {
    const adapter = createMockStorageAdapter({});
    const result = await handleCreatePage(adapter, {
      title: 'Hello World',
      pageType: 'landing',
    });

    expect(result.slug).toBe('hello-world');
    expect(result.title).toBe('Hello World');
    expect(result.pageType).toBe('landing');
  });

  it('should use provided slug if given', async () => {
    const adapter = createMockStorageAdapter({});
    const result = await handleCreatePage(adapter, {
      title: 'Hello World',
      pageType: 'landing',
      slug: 'custom-slug',
    });

    expect(result.slug).toBe('custom-slug');
  });

  it('should ensure slug uniqueness', async () => {
    const adapter = createMockStorageAdapter({
      'hello-world': {
        id: 'existing-id',
        slug: 'hello-world',
        pageType: 'landing',
        title: 'Hello World',
        sections: [],
        createdAt: testDate,
        updatedAt: testDate,
      },
    });

    const result = await handleCreatePage(adapter, {
      title: 'Hello World',
      pageType: 'landing',
    });

    expect(result.slug).toBe('hello-world-1');
  });

  it('should pass sections to adapter', async () => {
    const adapter = createMockStorageAdapter({});
    const sections = [{ id: 's1', type: 'hero', data: { title: 'Hi' } }];
    const result = await handleCreatePage(adapter, {
      title: 'Test',
      pageType: 'page',
      sections,
    });

    expect(result.sections).toEqual(sections);
  });

  it('should throw on empty title', async () => {
    const adapter = createMockStorageAdapter({});

    await expect(
      handleCreatePage(adapter, { title: '', pageType: 'landing' })
    ).rejects.toThrow(StorageValidationError);

    await expect(
      handleCreatePage(adapter, { title: '   ', pageType: 'landing' })
    ).rejects.toThrow('Page title must not be empty');
  });

  it('should throw StorageValidationError with correct code', async () => {
    const adapter = createMockStorageAdapter({});

    try {
      await handleCreatePage(adapter, { title: '', pageType: 'landing' });
    } catch (error) {
      expect(error).toBeInstanceOf(StorageValidationError);
      expect((error as StorageValidationError).code).toBe('EMPTY_TITLE');
    }
  });
});

describe('handleUpdatePage', () => {
  const existingPage: Page = {
    id: 'page-1',
    slug: 'hello-world',
    pageType: 'landing',
    title: 'Hello World',
    sections: [],
    createdAt: testDate,
    updatedAt: testDate,
  };

  it('should update a page', async () => {
    const adapter = createMockStorageAdapter({ 'hello-world': existingPage });
    const result = await handleUpdatePage(adapter, {
      id: 'page-1',
      title: 'Updated Title',
    });

    expect(result.title).toBe('Updated Title');
    expect(result.id).toBe('page-1');
  });

  it('should validate slug uniqueness on update', async () => {
    const adapter = createMockStorageAdapter({
      'hello-world': existingPage,
      'about': {
        id: 'page-2',
        slug: 'about',
        pageType: 'page',
        title: 'About',
        sections: [],
        createdAt: testDate,
        updatedAt: testDate,
      },
    });

    await expect(
      handleUpdatePage(adapter, { id: 'page-1', slug: 'about' })
    ).rejects.toThrow('Slug "about" is already in use');
  });

  it('should allow keeping the same slug', async () => {
    const adapter = createMockStorageAdapter({ 'hello-world': existingPage });

    // Updating with the same slug should not throw
    const result = await handleUpdatePage(adapter, {
      id: 'page-1',
      slug: 'hello-world',
    });

    expect(result.slug).toBe('hello-world');
  });

  it('should throw on empty ID', async () => {
    const adapter = createMockStorageAdapter({});

    await expect(
      handleUpdatePage(adapter, { id: '', title: 'Test' })
    ).rejects.toThrow('Page ID must not be empty');
  });

  it('should throw on empty title', async () => {
    const adapter = createMockStorageAdapter({ 'hello-world': existingPage });

    await expect(
      handleUpdatePage(adapter, { id: 'page-1', title: '' })
    ).rejects.toThrow('Page title must not be empty');
  });

  it('should throw on empty slug', async () => {
    const adapter = createMockStorageAdapter({ 'hello-world': existingPage });

    await expect(
      handleUpdatePage(adapter, { id: 'page-1', slug: '' })
    ).rejects.toThrow('Page slug must not be empty');
  });
});

describe('handleDeletePage', () => {
  it('should delete a page by ID', async () => {
    const adapter = createMockStorageAdapter({});
    // Should not throw
    await expect(handleDeletePage(adapter, 'page-1')).resolves.toBeUndefined();
  });

  it('should throw on empty ID', async () => {
    const adapter = createMockStorageAdapter({});

    await expect(handleDeletePage(adapter, '')).rejects.toThrow(
      'Page ID must not be empty'
    );
  });

  it('should throw StorageValidationError with correct code', async () => {
    const adapter = createMockStorageAdapter({});

    try {
      await handleDeletePage(adapter, '');
    } catch (error) {
      expect(error).toBeInstanceOf(StorageValidationError);
      expect((error as StorageValidationError).code).toBe('EMPTY_ID');
    }
  });
});
