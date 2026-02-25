import { describe, expect, expectTypeOf, it } from 'vitest';
import type {
  CreatePageInput,
  Navigation,
  NavigationItem,
  Page,
  PageFilter,
  PageSection,
  StorageAdapter,
  UpdatePageInput,
} from './types';

describe('Storage Types', () => {
  describe('Page', () => {
    it('should have correct structure', () => {
      const page: Page = {
        id: '123',
        slug: 'test-page',
        pageType: 'landing',
        title: 'Test Page',
        sections: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(page.id).toBe('123');
      expect(page.slug).toBe('test-page');
      expectTypeOf(page.sections).toEqualTypeOf<PageSection[]>();
    });

    it('should support sections with data', () => {
      const page: Page = {
        id: '123',
        slug: 'test-page',
        pageType: 'landing',
        title: 'Test Page',
        sections: [
          {
            id: 'section-1',
            type: 'hero',
            data: { title: 'Hello', subtitle: 'World' },
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(page.sections).toHaveLength(1);
      expect(page.sections[0].type).toBe('hero');
    });
  });

  describe('PageFilter', () => {
    it('should allow filtering by pageType', () => {
      const filter: PageFilter = {
        pageType: 'landing',
      };

      expectTypeOf(filter.pageType).toEqualTypeOf<string | undefined>();
    });

    it('should support pagination', () => {
      const filter: PageFilter = {
        limit: 10,
        offset: 0,
      };

      expectTypeOf(filter.limit).toEqualTypeOf<number | undefined>();
      expectTypeOf(filter.offset).toEqualTypeOf<number | undefined>();
    });
  });

  describe('CreatePageInput', () => {
    it('should require pageType and title', () => {
      const input: CreatePageInput = {
        pageType: 'landing',
        title: 'New Page',
      };

      expectTypeOf(input.pageType).toEqualTypeOf<string>();
      expectTypeOf(input.title).toEqualTypeOf<string>();
      expectTypeOf(input.slug).toEqualTypeOf<string | undefined>();
    });
  });

  describe('UpdatePageInput', () => {
    it('should require id and allow partial updates', () => {
      const input: UpdatePageInput = {
        id: '123',
        title: 'Updated Title',
      };

      expectTypeOf(input.id).toEqualTypeOf<string>();
      expectTypeOf(input.title).toEqualTypeOf<string | undefined>();
    });
  });

  describe('Navigation', () => {
    it('should have correct structure', () => {
      const nav: Navigation = {
        id: '123',
        name: 'main',
        items: [{ label: 'Home', href: '/' }],
        updatedAt: new Date(),
      };

      expect(nav.name).toBe('main');
      expectTypeOf(nav.items).toEqualTypeOf<NavigationItem[]>();
    });

    it('should support nested navigation items', () => {
      const nav: Navigation = {
        id: '123',
        name: 'main',
        items: [
          {
            label: 'Products',
            href: '/products',
            children: [
              { label: 'Category A', href: '/products/a' },
              { label: 'Category B', href: '/products/b' },
            ],
          },
        ],
        updatedAt: new Date(),
      };

      expect(nav.items[0].children).toHaveLength(2);
    });
  });

  describe('StorageAdapter interface', () => {
    it('should define all required methods', () => {
      const mockAdapter: StorageAdapter = {
        getPage: async () => null,
        getPageById: async () => null,
        createPage: async (input) => ({
          id: '1',
          slug: input.slug ?? 'generated',
          pageType: input.pageType,
          title: input.title,
          sections: input.sections ?? [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        updatePage: async (input) => ({
          id: input.id,
          slug: 'test',
          pageType: 'landing',
          title: input.title ?? 'Test',
          sections: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        deletePage: async () => {},
        listPages: async () => [],
        getNavigation: async () => null,
        getNavigationById: async () => null,
        createNavigation: async (input) => ({
          id: '1',
          name: input.name,
          items: input.items,
          updatedAt: new Date(),
        }),
        updateNavigation: async (input) => ({
          id: input.id,
          name: input.name ?? 'test',
          items: input.items ?? [],
          updatedAt: new Date(),
        }),
        deleteNavigation: async () => {},
        listNavigations: async () => [],
      };

      expect(mockAdapter.getPage).toBeDefined();
      expect(mockAdapter.createPage).toBeDefined();
      expect(mockAdapter.updatePage).toBeDefined();
      expect(mockAdapter.deletePage).toBeDefined();
      expect(mockAdapter.listPages).toBeDefined();
      expect(mockAdapter.getNavigation).toBeDefined();
      expect(mockAdapter.createNavigation).toBeDefined();
    });

    it('should have Supabase-agnostic types', () => {
      expectTypeOf<StorageAdapter['getPage']>().returns.resolves.toEqualTypeOf<Page | null>();
      expectTypeOf<StorageAdapter['listPages']>().returns.resolves.toEqualTypeOf<Page[]>();
    });
  });
});
