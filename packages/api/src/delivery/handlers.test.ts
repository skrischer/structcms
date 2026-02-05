import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { SupabaseStorageAdapter } from '../storage/supabase-adapter';
import {
  handleListPages,
  handleGetPageBySlug,
  handleGetNavigation,
} from './handlers';
import type { PageResponse, NavigationResponse } from './types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

describe('Delivery Handlers', () => {
  const testPrefix = `delivery-${Date.now()}`;
  let adapter: SupabaseStorageAdapter;
  let supabase: ReturnType<typeof createClient>;

  beforeAll(async () => {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Skipping delivery tests: Missing Supabase credentials');
      return;
    }
    supabase = createClient(supabaseUrl, supabaseKey);
    adapter = new SupabaseStorageAdapter({ client: supabase });

    // Create test data
    await adapter.createPage({
      slug: `${testPrefix}-home`,
      pageType: 'landing',
      title: 'Home Page',
      sections: [{ id: 'hero-1', type: 'hero', data: { title: 'Welcome' } }],
    });

    await adapter.createPage({
      slug: `${testPrefix}-about`,
      pageType: 'article',
      title: 'About Page',
      sections: [],
    });

    await adapter.createNavigation({
      name: `${testPrefix}-main`,
      items: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
      ],
    });
  });

  afterAll(async () => {
    if (!supabase) return;
    // Cleanup test data
    await supabase.from('pages').delete().like('slug', `${testPrefix}%`);
    await supabase.from('navigation').delete().like('name', `${testPrefix}%`);
  });

  describe('handleListPages', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should return all pages as PageResponse[]',
      async () => {
        const pages = await handleListPages(adapter);

        expect(Array.isArray(pages)).toBe(true);
        expect(pages.length).toBeGreaterThanOrEqual(2);

        // Find our test pages
        const homePage = pages.find((p) => p.slug === `${testPrefix}-home`);
        expect(homePage).toBeDefined();

        // Verify PageResponse structure
        const page = homePage as PageResponse;
        expect(page.id).toBeDefined();
        expect(page.slug).toBe(`${testPrefix}-home`);
        expect(page.pageType).toBe('landing');
        expect(page.title).toBe('Home Page');
        expect(page.sections).toEqual([
          { id: 'hero-1', type: 'hero', data: { title: 'Welcome' } },
        ]);
        expect(page.meta).toBeDefined();
        expect(typeof page.meta.createdAt).toBe('string');
        expect(typeof page.meta.updatedAt).toBe('string');
        // Verify ISO date format
        expect(() => new Date(page.meta.createdAt)).not.toThrow();
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should filter pages by pageType',
      async () => {
        const pages = await handleListPages(adapter, { pageType: 'landing' });

        const testPages = pages.filter((p) => p.slug.startsWith(testPrefix));
        expect(testPages.length).toBe(1);
        expect(testPages[0].pageType).toBe('landing');
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should support pagination',
      async () => {
        const pages = await handleListPages(adapter, { limit: 1 });

        expect(pages.length).toBe(1);
      }
    );
  });

  describe('handleGetPageBySlug', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should return a page by slug',
      async () => {
        const page = await handleGetPageBySlug(adapter, `${testPrefix}-home`);

        expect(page).not.toBeNull();
        const response = page as PageResponse;
        expect(response.slug).toBe(`${testPrefix}-home`);
        expect(response.pageType).toBe('landing');
        expect(response.title).toBe('Home Page');
        expect(response.sections).toHaveLength(1);
        expect(response.meta.createdAt).toBeDefined();
        expect(response.meta.updatedAt).toBeDefined();
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should return null for non-existent slug',
      async () => {
        const page = await handleGetPageBySlug(adapter, 'non-existent-slug');

        expect(page).toBeNull();
      }
    );
  });

  describe('handleGetNavigation', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should return a navigation by name',
      async () => {
        const nav = await handleGetNavigation(adapter, `${testPrefix}-main`);

        expect(nav).not.toBeNull();
        const response = nav as NavigationResponse;
        expect(response.name).toBe(`${testPrefix}-main`);
        expect(response.items).toEqual([
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
        ]);
        expect(response.meta.updatedAt).toBeDefined();
        expect(typeof response.meta.updatedAt).toBe('string');
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should return null for non-existent navigation',
      async () => {
        const nav = await handleGetNavigation(adapter, 'non-existent-nav');

        expect(nav).toBeNull();
      }
    );
  });
});
