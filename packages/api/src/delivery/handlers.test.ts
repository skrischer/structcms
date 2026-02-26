import { createClient } from '@supabase/supabase-js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { SupabaseMediaAdapter } from '../media/supabase-adapter';
import { SupabaseStorageAdapter } from '../storage/supabase-adapter';
import { handleGetNavigation, handleGetPageBySlug, handleListPages } from './handlers';
import type { NavigationResponse, PageResponse } from './types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

describe('Delivery Handlers', () => {
  const testPrefix = `delivery-${Date.now()}`;
  let adapter: SupabaseStorageAdapter;
  let mediaAdapter: SupabaseMediaAdapter;
  let supabase: ReturnType<typeof createClient>;
  let testMediaId: string;

  beforeAll(async () => {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Skipping delivery tests: Missing Supabase credentials');
      return;
    }
    supabase = createClient(supabaseUrl, supabaseKey);
    adapter = new SupabaseStorageAdapter({ client: supabase });
    mediaAdapter = new SupabaseMediaAdapter({ client: supabase });

    // Upload test media
    const testData = new TextEncoder().encode('test image for delivery');
    const media = await mediaAdapter.upload({
      filename: `${testPrefix}-test.jpg`,
      mimeType: 'image/jpeg',
      size: testData.length,
      data: testData,
    });
    testMediaId = media.id;

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

    await adapter.createPage({
      slug: `${testPrefix}-media-page`,
      pageType: 'landing',
      title: 'Page with Media',
      sections: [
        {
          id: 'hero-1',
          type: 'hero',
          data: { title: 'Hero with image', image: testMediaId },
        },
      ],
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
    if (testMediaId) {
      await mediaAdapter.deleteMedia(testMediaId);
    }
  });

  describe('handleListPages', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should return all pages as PageResponse[]',
      async () => {
        const pages = await handleListPages(adapter, mediaAdapter);

        expect(Array.isArray(pages)).toBe(true);
        expect(pages.length).toBeGreaterThanOrEqual(3);

        // Find our test pages
        const homePage = pages.find((p) => p.slug === `${testPrefix}-home`);
        expect(homePage).toBeDefined();

        // Verify PageResponse structure
        const page = homePage as PageResponse;
        expect(page.id).toBeDefined();
        expect(page.slug).toBe(`${testPrefix}-home`);
        expect(page.pageType).toBe('landing');
        expect(page.title).toBe('Home Page');
        expect(page.sections).toEqual([{ id: 'hero-1', type: 'hero', data: { title: 'Welcome' } }]);
        expect(page.meta).toBeDefined();
        expect(typeof page.meta.createdAt).toBe('string');
        expect(typeof page.meta.updatedAt).toBe('string');
        // Verify ISO date format
        expect(() => new Date(page.meta.createdAt)).not.toThrow();
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)('should filter pages by pageType', async () => {
      const pages = await handleListPages(adapter, mediaAdapter, { pageType: 'landing' });

      const testPages = pages.filter((p) => p.slug.startsWith(testPrefix));
      expect(testPages.length).toBeGreaterThanOrEqual(2);
      for (const page of testPages) {
        expect(page.pageType).toBe('landing');
      }
    });

    it.skipIf(!supabaseUrl || !supabaseKey)('should support pagination', async () => {
      const pages = await handleListPages(adapter, mediaAdapter, { limit: 1 });

      expect(pages.length).toBe(1);
    });

    it.skipIf(!supabaseUrl || !supabaseKey)('should resolve media references to URLs', async () => {
      const pages = await handleListPages(adapter, mediaAdapter);

      const mediaPage = pages.find((p) => p.slug === `${testPrefix}-media-page`);
      expect(mediaPage).toBeDefined();

      const imageUrl = mediaPage?.sections[0].data.image;
      expect(typeof imageUrl).toBe('string');
      expect(imageUrl).toContain('supabase');
      // Should not be a UUID anymore
      expect(imageUrl).not.toBe(testMediaId);
    });
  });

  describe('handleGetPageBySlug', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)('should return a page by slug', async () => {
      const page = await handleGetPageBySlug(adapter, mediaAdapter, `${testPrefix}-home`);

      expect(page).not.toBeNull();
      const response = page as PageResponse;
      expect(response.slug).toBe(`${testPrefix}-home`);
      expect(response.pageType).toBe('landing');
      expect(response.title).toBe('Home Page');
      expect(response.sections).toHaveLength(1);
      expect(response.meta.createdAt).toBeDefined();
      expect(response.meta.updatedAt).toBeDefined();
    });

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should return null for non-existent slug',
      async () => {
        const page = await handleGetPageBySlug(adapter, mediaAdapter, 'non-existent-slug');

        expect(page).toBeNull();
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should resolve media references to URLs in page sections',
      async () => {
        const page = await handleGetPageBySlug(adapter, mediaAdapter, `${testPrefix}-media-page`);

        expect(page).not.toBeNull();
        expect(page?.sections).toHaveLength(1);

        const imageUrl = page?.sections[0].data.image;
        expect(typeof imageUrl).toBe('string');
        expect(imageUrl).toContain('supabase');
        // Should be a full URL, not the UUID
        expect(imageUrl).not.toBe(testMediaId);
      }
    );
  });

  describe('handleGetNavigation', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)('should return a navigation by name', async () => {
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
    });

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should return null for non-existent navigation',
      async () => {
        const nav = await handleGetNavigation(adapter, 'non-existent-nav');

        expect(nav).toBeNull();
      }
    );
  });
});
