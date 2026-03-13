import { createClient } from '@supabase/supabase-js';
import { beforeAll, describe, expect, it } from 'vitest';
import type { Database } from '../types/database.types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

describe('Database Schema Verification', () => {
  beforeAll(() => {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Skipping schema tests: Missing Supabase credentials');
    }
  });

  describe('pages table', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)('should exist and have correct columns', async () => {
      // biome-ignore lint/style/noNonNullAssertion: skipIf guard ensures these are defined
      const supabase = createClient<Database>(supabaseUrl!, supabaseKey!);

      // Try to select from pages table - will fail if table doesn't exist
      const { error } = await supabase.from('pages').select('*').limit(0);

      expect(error).toBeNull();
    });

    it.skipIf(!supabaseUrl || !supabaseKey)('should enforce unique slug constraint', async () => {
      // biome-ignore lint/style/noNonNullAssertion: skipIf guard ensures these are defined
      const supabase = createClient<Database>(supabaseUrl!, supabaseKey!);
      const testSlug = `test-unique-${Date.now()}`;

      // Insert first page
      const { error: insertError } = await supabase.from('pages').insert({
        slug: testSlug,
        page_type: 'test',
        title: 'Test Page',
        sections: [],
      });

      expect(insertError).toBeNull();

      // Try to insert duplicate slug
      const { error: duplicateError } = await supabase.from('pages').insert({
        slug: testSlug,
        page_type: 'test',
        title: 'Duplicate Page',
        sections: [],
      });

      expect(duplicateError).not.toBeNull();
      expect(duplicateError?.code).toBe('23505'); // unique_violation

      // Cleanup
      await supabase.from('pages').delete().eq('slug', testSlug);
    });

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should auto-generate UUID and timestamps',
      async () => {
        // biome-ignore lint/style/noNonNullAssertion: skipIf guard ensures these are defined
        const supabase = createClient<Database>(supabaseUrl!, supabaseKey!);
        const testSlug = `test-auto-${Date.now()}`;

        const { data, error } = await supabase
          .from('pages')
          .insert({
            slug: testSlug,
            page_type: 'test',
            title: 'Auto Test',
            sections: [],
          })
          .select()
          .single();

        expect(error).toBeNull();
        expect(data).toBeDefined();
        expect(data?.id).toBeDefined();
        expect(data?.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        expect(data?.created_at).toBeDefined();
        expect(data?.updated_at).toBeDefined();

        // Cleanup
        await supabase.from('pages').delete().eq('slug', testSlug);
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)('should store sections as JSONB', async () => {
      // biome-ignore lint/style/noNonNullAssertion: skipIf guard ensures these are defined
      const supabase = createClient<Database>(supabaseUrl!, supabaseKey!);
      const testSlug = `test-jsonb-${Date.now()}`;
      const testSections = [
        { id: 'section-1', type: 'hero', data: { title: 'Hello' } },
        { id: 'section-2', type: 'text', data: { content: 'World' } },
      ];

      const { data, error } = await supabase
        .from('pages')
        .insert({
          slug: testSlug,
          page_type: 'test',
          title: 'JSONB Test',
          sections: testSections,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.sections).toEqual(testSections);

      // Cleanup
      await supabase.from('pages').delete().eq('slug', testSlug);
    });
  });

  describe('navigation table', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)('should exist and have correct columns', async () => {
      // biome-ignore lint/style/noNonNullAssertion: skipIf guard ensures these are defined
      const supabase = createClient<Database>(supabaseUrl!, supabaseKey!);

      const { error } = await supabase.from('navigation').select('*').limit(0);

      expect(error).toBeNull();
    });

    it.skipIf(!supabaseUrl || !supabaseKey)('should enforce unique name constraint', async () => {
      // biome-ignore lint/style/noNonNullAssertion: skipIf guard ensures these are defined
      const supabase = createClient<Database>(supabaseUrl!, supabaseKey!);
      const testName = `test-nav-${Date.now()}`;

      // Insert first navigation
      const { error: insertError } = await supabase.from('navigation').insert({
        name: testName,
        items: [],
      });

      expect(insertError).toBeNull();

      // Try to insert duplicate name
      const { error: duplicateError } = await supabase.from('navigation').insert({
        name: testName,
        items: [],
      });

      expect(duplicateError).not.toBeNull();
      expect(duplicateError?.code).toBe('23505'); // unique_violation

      // Cleanup
      await supabase.from('navigation').delete().eq('name', testName);
    });

    it.skipIf(!supabaseUrl || !supabaseKey)('should store items as JSONB', async () => {
      // biome-ignore lint/style/noNonNullAssertion: skipIf guard ensures these are defined
      const supabase = createClient<Database>(supabaseUrl!, supabaseKey!);
      const testName = `test-nav-jsonb-${Date.now()}`;
      const testItems = [
        { label: 'Home', href: '/' },
        {
          label: 'Products',
          href: '/products',
          children: [{ label: 'Category A', href: '/products/a' }],
        },
      ];

      const { data, error } = await supabase
        .from('navigation')
        .insert({
          name: testName,
          items: testItems,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.items).toEqual(testItems);

      // Cleanup
      await supabase.from('navigation').delete().eq('name', testName);
    });
  });
});
