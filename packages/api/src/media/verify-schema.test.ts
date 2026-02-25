import { type SupabaseClient, createClient } from '@supabase/supabase-js';
import { beforeAll, describe, expect, it } from 'vitest';
import type { Database } from '../types/database.types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

describe('Media Table Schema', () => {
  let supabase: SupabaseClient<Database>;

  beforeAll(() => {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Skipping schema tests: Missing Supabase credentials');
      return;
    }
    supabase = createClient<Database>(supabaseUrl, supabaseKey);
  });

  it.skipIf(!supabaseUrl || !supabaseKey)(
    'should have media table with correct columns',
    async () => {
      const testId = `test-${Date.now()}`;

      // Insert test record
      const { data: inserted, error: insertError } = await supabase
        .from('media')
        .insert({
          filename: `${testId}.jpg`,
          storage_path: `media/${testId}.jpg`,
          mime_type: 'image/jpeg',
          size: 1024,
        })
        .select()
        .single();

      expect(insertError).toBeNull();
      expect(inserted).toBeDefined();
      expect(inserted?.id).toBeDefined();
      expect(inserted?.filename).toBe(`${testId}.jpg`);
      expect(inserted?.storage_path).toBe(`media/${testId}.jpg`);
      expect(inserted?.mime_type).toBe('image/jpeg');
      expect(inserted?.size).toBe(1024);
      expect(inserted?.created_at).toBeDefined();
      expect(inserted?.updated_at).toBeDefined();

      // Cleanup
      await supabase.from('media').delete().eq('id', inserted?.id);
    }
  );

  it.skipIf(!supabaseUrl || !supabaseKey)('should auto-generate UUID for id', async () => {
    const testId = `test-uuid-${Date.now()}`;

    const { data, error } = await supabase
      .from('media')
      .insert({
        filename: `${testId}.png`,
        storage_path: `media/${testId}.png`,
        mime_type: 'image/png',
        size: 512,
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data?.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

    // Cleanup
    await supabase.from('media').delete().eq('id', data?.id);
  });

  it.skipIf(!supabaseUrl || !supabaseKey)('should auto-update updated_at on update', async () => {
    const testId = `test-update-${Date.now()}`;

    // Insert
    const { data: insertedData } = await supabase
      .from('media')
      .insert({
        filename: `${testId}.gif`,
        storage_path: `media/${testId}.gif`,
        mime_type: 'image/gif',
        size: 256,
      })
      .select()
      .single();

    // Wait a moment
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Update
    const { data: updatedData } = await supabase
      .from('media')
      .update({ filename: `${testId}-updated.gif` })
      .eq('id', insertedData?.id)
      .select()
      .single();

    expect(new Date(updatedData?.updated_at).getTime()).toBeGreaterThan(
      new Date(insertedData?.updated_at).getTime()
    );

    // Cleanup
    await supabase.from('media').delete().eq('id', insertedData?.id);
  });
});
