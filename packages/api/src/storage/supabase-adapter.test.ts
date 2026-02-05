import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import {
  SupabaseStorageAdapter,
  createStorageAdapter,
  StorageError,
} from './supabase-adapter';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

describe('SupabaseStorageAdapter', () => {
  const testPrefix = `test-${Date.now()}`;
  let adapter: SupabaseStorageAdapter;
  let supabase: ReturnType<typeof createClient>;

  beforeAll(() => {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Skipping adapter tests: Missing Supabase credentials');
      return;
    }
    supabase = createClient(supabaseUrl, supabaseKey);
    adapter = new SupabaseStorageAdapter({ client: supabase });
  });

  afterAll(async () => {
    if (!supabase) return;
    // Cleanup test data
    await supabase.from('pages').delete().like('slug', `${testPrefix}%`);
    await supabase.from('navigation').delete().like('name', `${testPrefix}%`);
  });

  describe('createStorageAdapter', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should create a storage adapter',
      () => {
        const storage = createStorageAdapter({ client: supabase });
        expect(storage).toBeDefined();
        expect(storage.getPage).toBeDefined();
        expect(storage.createPage).toBeDefined();
      }
    );
  });

  describe('Page CRUD', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should create a page with auto-generated slug',
      async () => {
        const page = await adapter.createPage({
          pageType: 'landing',
          title: `${testPrefix} Test Page`,
        });

        expect(page.id).toBeDefined();
        expect(page.slug).toBe(`${testPrefix}-test-page`);
        expect(page.pageType).toBe('landing');
        expect(page.title).toBe(`${testPrefix} Test Page`);
        expect(page.sections).toEqual([]);
        expect(page.createdAt).toBeInstanceOf(Date);
        expect(page.updatedAt).toBeInstanceOf(Date);
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should create a page with custom slug',
      async () => {
        const page = await adapter.createPage({
          slug: `${testPrefix}-custom-slug`,
          pageType: 'article',
          title: 'Custom Slug Page',
        });

        expect(page.slug).toBe(`${testPrefix}-custom-slug`);
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should create a page with sections',
      async () => {
        const sections = [
          { id: 'hero-1', type: 'hero', data: { title: 'Hello' } },
          { id: 'text-1', type: 'text', data: { content: 'World' } },
        ];

        const page = await adapter.createPage({
          pageType: 'landing',
          title: `${testPrefix} Sections Page`,
          sections,
        });

        expect(page.sections).toEqual(sections);
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should ensure unique slugs',
      async () => {
        const page1 = await adapter.createPage({
          pageType: 'landing',
          title: `${testPrefix} Duplicate`,
        });

        const page2 = await adapter.createPage({
          pageType: 'landing',
          title: `${testPrefix} Duplicate`,
        });

        expect(page1.slug).toBe(`${testPrefix}-duplicate`);
        expect(page2.slug).toBe(`${testPrefix}-duplicate-1`);
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should get page by slug',
      async () => {
        const created = await adapter.createPage({
          slug: `${testPrefix}-get-by-slug`,
          pageType: 'landing',
          title: 'Get By Slug',
        });

        const page = await adapter.getPage(`${testPrefix}-get-by-slug`);

        expect(page).not.toBeNull();
        expect(page?.id).toBe(created.id);
        expect(page?.title).toBe('Get By Slug');
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should return null for non-existent page',
      async () => {
        const page = await adapter.getPage('non-existent-slug-12345');
        expect(page).toBeNull();
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should get page by id',
      async () => {
        const created = await adapter.createPage({
          slug: `${testPrefix}-get-by-id`,
          pageType: 'landing',
          title: 'Get By ID',
        });

        const page = await adapter.getPageById(created.id);

        expect(page).not.toBeNull();
        expect(page?.slug).toBe(`${testPrefix}-get-by-id`);
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should update a page',
      async () => {
        const created = await adapter.createPage({
          slug: `${testPrefix}-update-test`,
          pageType: 'landing',
          title: 'Original Title',
        });

        const updated = await adapter.updatePage({
          id: created.id,
          title: 'Updated Title',
          sections: [{ id: 'new-1', type: 'hero', data: {} }],
        });

        expect(updated.title).toBe('Updated Title');
        expect(updated.sections).toHaveLength(1);
        expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
          created.updatedAt.getTime()
        );
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should delete a page',
      async () => {
        const created = await adapter.createPage({
          slug: `${testPrefix}-delete-test`,
          pageType: 'landing',
          title: 'To Delete',
        });

        await adapter.deletePage(created.id);

        const page = await adapter.getPageById(created.id);
        expect(page).toBeNull();
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should list pages',
      async () => {
        // Create a few pages
        await adapter.createPage({
          slug: `${testPrefix}-list-1`,
          pageType: 'landing',
          title: 'List Page 1',
        });
        await adapter.createPage({
          slug: `${testPrefix}-list-2`,
          pageType: 'article',
          title: 'List Page 2',
        });

        const pages = await adapter.listPages();

        expect(pages.length).toBeGreaterThanOrEqual(2);
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should filter pages by pageType',
      async () => {
        const uniqueType = `${testPrefix}-filter-type`;

        await adapter.createPage({
          slug: `${testPrefix}-filter-1`,
          pageType: uniqueType,
          title: 'Filter Page 1',
        });
        await adapter.createPage({
          slug: `${testPrefix}-filter-2`,
          pageType: uniqueType,
          title: 'Filter Page 2',
        });

        const pages = await adapter.listPages({ pageType: uniqueType });

        expect(pages).toHaveLength(2);
        expect(pages.every((p) => p.pageType === uniqueType)).toBe(true);
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should paginate pages',
      async () => {
        const pages = await adapter.listPages({ limit: 2, offset: 0 });
        expect(pages.length).toBeLessThanOrEqual(2);
      }
    );
  });

  describe('Navigation CRUD', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should create a navigation',
      async () => {
        const nav = await adapter.createNavigation({
          name: `${testPrefix}-main`,
          items: [{ label: 'Home', href: '/' }],
        });

        expect(nav.id).toBeDefined();
        expect(nav.name).toBe(`${testPrefix}-main`);
        expect(nav.items).toEqual([{ label: 'Home', href: '/' }]);
        expect(nav.updatedAt).toBeInstanceOf(Date);
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should reject duplicate navigation names',
      async () => {
        await adapter.createNavigation({
          name: `${testPrefix}-duplicate-nav`,
          items: [],
        });

        await expect(
          adapter.createNavigation({
            name: `${testPrefix}-duplicate-nav`,
            items: [],
          })
        ).rejects.toThrow(StorageError);
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should get navigation by name',
      async () => {
        await adapter.createNavigation({
          name: `${testPrefix}-get-nav`,
          items: [{ label: 'Test', href: '/test' }],
        });

        const nav = await adapter.getNavigation(`${testPrefix}-get-nav`);

        expect(nav).not.toBeNull();
        expect(nav?.items).toEqual([{ label: 'Test', href: '/test' }]);
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should return null for non-existent navigation',
      async () => {
        const nav = await adapter.getNavigation('non-existent-nav-12345');
        expect(nav).toBeNull();
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should update a navigation',
      async () => {
        const created = await adapter.createNavigation({
          name: `${testPrefix}-update-nav`,
          items: [{ label: 'Old', href: '/old' }],
        });

        const updated = await adapter.updateNavigation({
          id: created.id,
          items: [
            { label: 'New', href: '/new' },
            { label: 'Another', href: '/another' },
          ],
        });

        expect(updated.items).toHaveLength(2);
        expect(updated.items[0].label).toBe('New');
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should delete a navigation',
      async () => {
        const created = await adapter.createNavigation({
          name: `${testPrefix}-delete-nav`,
          items: [],
        });

        await adapter.deleteNavigation(created.id);

        const nav = await adapter.getNavigationById(created.id);
        expect(nav).toBeNull();
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should list navigations',
      async () => {
        await adapter.createNavigation({
          name: `${testPrefix}-list-nav-1`,
          items: [],
        });
        await adapter.createNavigation({
          name: `${testPrefix}-list-nav-2`,
          items: [],
        });

        const navs = await adapter.listNavigations();

        expect(navs.length).toBeGreaterThanOrEqual(2);
      }
    );
  });
});
