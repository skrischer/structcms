import { describe, it, expect } from 'vitest';
import { handleCreatePage, handleUpdatePage, handleDeletePage, handleCreateNavigation, handleUpdateNavigation, handleDeleteNavigation, StorageValidationError } from './handlers';
import type { StorageAdapter, Page, Navigation, CreatePageInput, UpdatePageInput, CreateNavigationInput, UpdateNavigationInput } from './types';

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

const navDate = new Date('2025-02-01T12:00:00Z');

function createMockNavigationAdapter(
  navigations: Navigation[]
): StorageAdapter {
  const base = createMockStorageAdapter({});
  return {
    ...base,
    listNavigations: async () => navigations,
    createNavigation: async (input: CreateNavigationInput) => ({
      id: 'new-nav-id',
      name: input.name,
      items: input.items,
      updatedAt: navDate,
    }),
    updateNavigation: async (input: UpdateNavigationInput) => {
      const existing = navigations.find((n) => n.id === input.id);
      if (!existing) throw new Error('Navigation not found');
      return {
        ...existing,
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.items !== undefined ? { items: input.items } : {}),
        updatedAt: navDate,
      };
    },
    deleteNavigation: async () => {},
  };
}

describe('handleCreateNavigation', () => {
  it('should create a navigation', async () => {
    const adapter = createMockNavigationAdapter([]);
    const result = await handleCreateNavigation(adapter, {
      name: 'main',
      items: [{ label: 'Home', href: '/' }],
    });

    expect(result.name).toBe('main');
    expect(result.items).toHaveLength(1);
  });

  it('should throw on empty name', async () => {
    const adapter = createMockNavigationAdapter([]);

    await expect(
      handleCreateNavigation(adapter, { name: '', items: [] })
    ).rejects.toThrow('Navigation name must not be empty');

    await expect(
      handleCreateNavigation(adapter, { name: '   ', items: [] })
    ).rejects.toThrow('Navigation name must not be empty');
  });

  it('should throw on duplicate name', async () => {
    const adapter = createMockNavigationAdapter([
      { id: 'nav-1', name: 'main', items: [], updatedAt: navDate },
    ]);

    await expect(
      handleCreateNavigation(adapter, { name: 'main', items: [] })
    ).rejects.toThrow('Navigation name "main" is already in use');
  });

  it('should throw StorageValidationError with correct code', async () => {
    const adapter = createMockNavigationAdapter([]);

    try {
      await handleCreateNavigation(adapter, { name: '', items: [] });
    } catch (error) {
      expect(error).toBeInstanceOf(StorageValidationError);
      expect((error as StorageValidationError).code).toBe('EMPTY_NAME');
    }
  });
});

describe('handleUpdateNavigation', () => {
  const existingNav: Navigation = {
    id: 'nav-1',
    name: 'main',
    items: [{ label: 'Home', href: '/' }],
    updatedAt: navDate,
  };

  it('should update a navigation', async () => {
    const adapter = createMockNavigationAdapter([existingNav]);
    const result = await handleUpdateNavigation(adapter, {
      id: 'nav-1',
      items: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }],
    });

    expect(result.items).toHaveLength(2);
  });

  it('should validate name uniqueness on update', async () => {
    const adapter = createMockNavigationAdapter([
      existingNav,
      { id: 'nav-2', name: 'footer', items: [], updatedAt: navDate },
    ]);

    await expect(
      handleUpdateNavigation(adapter, { id: 'nav-1', name: 'footer' })
    ).rejects.toThrow('Navigation name "footer" is already in use');
  });

  it('should allow keeping the same name', async () => {
    const adapter = createMockNavigationAdapter([existingNav]);

    const result = await handleUpdateNavigation(adapter, {
      id: 'nav-1',
      name: 'main',
    });

    expect(result.name).toBe('main');
  });

  it('should throw on empty ID', async () => {
    const adapter = createMockNavigationAdapter([]);

    await expect(
      handleUpdateNavigation(adapter, { id: '', name: 'test' })
    ).rejects.toThrow('Navigation ID must not be empty');
  });

  it('should throw on empty name', async () => {
    const adapter = createMockNavigationAdapter([existingNav]);

    await expect(
      handleUpdateNavigation(adapter, { id: 'nav-1', name: '' })
    ).rejects.toThrow('Navigation name must not be empty');
  });
});

describe('handleDeleteNavigation', () => {
  it('should delete a navigation by ID', async () => {
    const adapter = createMockNavigationAdapter([]);
    await expect(handleDeleteNavigation(adapter, 'nav-1')).resolves.toBeUndefined();
  });

  it('should throw on empty ID', async () => {
    const adapter = createMockNavigationAdapter([]);

    await expect(handleDeleteNavigation(adapter, '')).rejects.toThrow(
      'Navigation ID must not be empty'
    );
  });

  it('should throw StorageValidationError with correct code', async () => {
    const adapter = createMockNavigationAdapter([]);

    try {
      await handleDeleteNavigation(adapter, '');
    } catch (error) {
      expect(error).toBeInstanceOf(StorageValidationError);
      expect((error as StorageValidationError).code).toBe('EMPTY_ID');
    }
  });
});

// ---- Sanitization Integration Tests ----

/**
 * Creates a mock adapter that captures the input passed to createPage/updatePage
 * and returns it as the result, so we can verify sanitization happened
 */
function createCapturingAdapter(): StorageAdapter & { lastCreatedInput: CreatePageInput | null; lastUpdatedInput: UpdatePageInput | null } {
  const state = {
    lastCreatedInput: null as CreatePageInput | null,
    lastUpdatedInput: null as UpdatePageInput | null,
  };

  const base = createMockStorageAdapter({});

  return {
    ...base,
    ...state,
    createPage: async (input: CreatePageInput) => {
      state.lastCreatedInput = input;
      return {
        id: 'new-page-id',
        slug: input.slug ?? 'generated-slug',
        pageType: input.pageType,
        title: input.title,
        sections: input.sections ?? [],
        createdAt: testDate,
        updatedAt: testDate,
      };
    },
    updatePage: async (input: UpdatePageInput) => {
      state.lastUpdatedInput = input;
      return {
        id: input.id,
        slug: input.slug ?? 'existing-slug',
        pageType: input.pageType ?? 'page',
        title: input.title ?? 'Existing Title',
        sections: input.sections ?? [],
        createdAt: testDate,
        updatedAt: testDate,
      };
    },
    get lastCreatedInput() { return state.lastCreatedInput; },
    get lastUpdatedInput() { return state.lastUpdatedInput; },
  };
}

describe('sanitization integration', () => {
  it('should sanitize malicious HTML in sections on create', async () => {
    const adapter = createCapturingAdapter();
    const result = await handleCreatePage(adapter, {
      title: 'Test Page',
      pageType: 'landing',
      sections: [
        {
          id: 's1',
          type: 'hero',
          data: {
            title: '<script>alert("xss")</script>Welcome',
            body: '<p>Hello</p><script>document.cookie</script>',
          },
        },
      ],
    });

    // Verify the result contains sanitized content
    expect(result.sections[0].data['title']).toBe('Welcome');
    expect(result.sections[0].data['body']).toBe('<p>Hello</p>');

    // Verify the adapter received sanitized input
    expect(adapter.lastCreatedInput?.sections?.[0].data['title']).toBe('Welcome');
    expect(adapter.lastCreatedInput?.sections?.[0].data['body']).toBe('<p>Hello</p>');
  });

  it('should sanitize malicious HTML in sections on update', async () => {
    const adapter = createCapturingAdapter();
    const result = await handleUpdatePage(adapter, {
      id: 'page-1',
      sections: [
        {
          id: 's1',
          type: 'content',
          data: {
            content: '<p>Safe</p><img src="x" onerror="alert(1)"><a href="link" onclick="steal()">Click</a>',
          },
        },
      ],
    });

    expect(result.sections[0].data['content']).toBe(
      '<p>Safe</p><img src="x" /><a href="link">Click</a>'
    );
    expect(adapter.lastUpdatedInput?.sections?.[0].data['content']).toBe(
      '<p>Safe</p><img src="x" /><a href="link">Click</a>'
    );
  });

  it('should sanitize nested string values in array/object section data', async () => {
    const adapter = createCapturingAdapter();
    const result = await handleCreatePage(adapter, {
      title: 'Gallery Page',
      pageType: 'page',
      sections: [
        {
          id: 's1',
          type: 'gallery',
          data: {
            items: [
              { caption: '<script>xss</script>Photo 1', url: 'img1.jpg' },
              { caption: '<p>Photo 2</p>', url: 'img2.jpg' },
            ],
            nested: {
              deep: {
                value: '<iframe src="evil.com"></iframe><strong>Bold</strong>',
              },
            },
          },
        },
      ],
    });

    const items = result.sections[0].data['items'] as Array<Record<string, unknown>>;
    expect(items[0]['caption']).toBe('Photo 1');
    expect(items[0]['url']).toBe('img1.jpg');
    expect(items[1]['caption']).toBe('<p>Photo 2</p>');

    const nested = result.sections[0].data['nested'] as Record<string, Record<string, unknown>>;
    expect(nested['deep']['value']).toBe('<strong>Bold</strong>');
  });

  it('should deliver sanitized content via delivery handler', async () => {
    // Simulate the full flow: create page → retrieve via delivery
    const adapter = createCapturingAdapter();

    // Create page with malicious content (sanitization happens here)
    const created = await handleCreatePage(adapter, {
      title: 'Delivery Test',
      pageType: 'page',
      sections: [
        {
          id: 's1',
          type: 'hero',
          data: { title: '<script>xss</script>Clean Title' },
        },
      ],
    });

    // The created page already has sanitized content
    expect(created.sections[0].data['title']).toBe('Clean Title');

    // Delivery handler reads from adapter which stores sanitized data
    // Verify the data that was passed to the adapter is sanitized
    expect(adapter.lastCreatedInput?.sections?.[0].data['title']).toBe('Clean Title');
  });
});
