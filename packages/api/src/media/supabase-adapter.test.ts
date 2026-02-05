import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { SupabaseMediaAdapter, createMediaAdapter, MediaError } from './supabase-adapter';
import type { MediaFile } from './types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

describe('SupabaseMediaAdapter', () => {
  const testPrefix = `media-test-${Date.now()}`;
  let adapter: SupabaseMediaAdapter;
  let supabase: ReturnType<typeof createClient>;
  const uploadedMediaIds: string[] = [];

  beforeAll(() => {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Skipping media adapter tests: Missing Supabase credentials');
      return;
    }
    supabase = createClient(supabaseUrl, supabaseKey);
    adapter = new SupabaseMediaAdapter({ client: supabase });
  });

  afterAll(async () => {
    if (!supabase) return;
    // Cleanup: delete all test media
    for (const id of uploadedMediaIds) {
      try {
        await adapter.deleteMedia(id);
      } catch {
        // Ignore cleanup errors
      }
    }
  });

  describe('createMediaAdapter', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should create a media adapter',
      () => {
        const media = createMediaAdapter({ client: supabase });
        expect(media).toBeDefined();
        expect(media.upload).toBeDefined();
        expect(media.getMedia).toBeDefined();
        expect(media.listMedia).toBeDefined();
        expect(media.deleteMedia).toBeDefined();
      }
    );
  });

  describe('upload', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should upload a file and return MediaFile',
      async () => {
        const testData = new TextEncoder().encode('test image content');
        
        const result = await adapter.upload({
          filename: `${testPrefix}-test.jpg`,
          mimeType: 'image/jpeg',
          size: testData.length,
          data: testData,
        });

        uploadedMediaIds.push(result.id);

        expect(result.id).toBeDefined();
        expect(result.filename).toBe(`${testPrefix}-test.jpg`);
        expect(result.url).toContain('supabase');
        expect(result.url).toContain('media');
        expect(result.mimeType).toBe('image/jpeg');
        expect(result.size).toBe(testData.length);
        expect(result.createdAt).toBeInstanceOf(Date);
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should generate unique storage paths for same filename',
      async () => {
        const testData1 = new TextEncoder().encode('content 1');
        const testData2 = new TextEncoder().encode('content 2');

        const result1 = await adapter.upload({
          filename: `${testPrefix}-duplicate.png`,
          mimeType: 'image/png',
          size: testData1.length,
          data: testData1,
        });
        uploadedMediaIds.push(result1.id);

        const result2 = await adapter.upload({
          filename: `${testPrefix}-duplicate.png`,
          mimeType: 'image/png',
          size: testData2.length,
          data: testData2,
        });
        uploadedMediaIds.push(result2.id);

        expect(result1.id).not.toBe(result2.id);
        expect(result1.url).not.toBe(result2.url);
      }
    );
  });

  describe('getMedia', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should retrieve uploaded media by id',
      async () => {
        const testData = new TextEncoder().encode('get test content');
        
        const uploaded = await adapter.upload({
          filename: `${testPrefix}-get-test.gif`,
          mimeType: 'image/gif',
          size: testData.length,
          data: testData,
        });
        uploadedMediaIds.push(uploaded.id);

        const retrieved = await adapter.getMedia(uploaded.id);

        expect(retrieved).not.toBeNull();
        const media = retrieved as MediaFile;
        expect(media.id).toBe(uploaded.id);
        expect(media.filename).toBe(`${testPrefix}-get-test.gif`);
        expect(media.url).toBe(uploaded.url);
        expect(media.mimeType).toBe('image/gif');
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should return null for non-existent id',
      async () => {
        const result = await adapter.getMedia('00000000-0000-0000-0000-000000000000');
        expect(result).toBeNull();
      }
    );
  });

  describe('listMedia', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should list media files',
      async () => {
        const testData = new TextEncoder().encode('list test');
        
        await adapter.upload({
          filename: `${testPrefix}-list-1.webp`,
          mimeType: 'image/webp',
          size: testData.length,
          data: testData,
        }).then(r => uploadedMediaIds.push(r.id));

        await adapter.upload({
          filename: `${testPrefix}-list-2.webp`,
          mimeType: 'image/webp',
          size: testData.length,
          data: testData,
        }).then(r => uploadedMediaIds.push(r.id));

        const list = await adapter.listMedia();

        expect(Array.isArray(list)).toBe(true);
        expect(list.length).toBeGreaterThanOrEqual(2);
        
        const testFiles = list.filter(m => m.filename.startsWith(testPrefix));
        expect(testFiles.length).toBeGreaterThanOrEqual(2);
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should support pagination',
      async () => {
        const list = await adapter.listMedia({ limit: 1 });
        expect(list.length).toBe(1);
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should filter by mimeType',
      async () => {
        const testData = new TextEncoder().encode('filter test');
        
        await adapter.upload({
          filename: `${testPrefix}-filter.svg`,
          mimeType: 'image/svg+xml',
          size: testData.length,
          data: testData,
        }).then(r => uploadedMediaIds.push(r.id));

        const svgList = await adapter.listMedia({ mimeType: 'image/svg+xml' });
        
        expect(svgList.every(m => m.mimeType === 'image/svg+xml')).toBe(true);
      }
    );
  });

  describe('deleteMedia', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should delete media from storage and database',
      async () => {
        const testData = new TextEncoder().encode('delete test');
        
        const uploaded = await adapter.upload({
          filename: `${testPrefix}-delete.png`,
          mimeType: 'image/png',
          size: testData.length,
          data: testData,
        });

        // Verify it exists
        const beforeDelete = await adapter.getMedia(uploaded.id);
        expect(beforeDelete).not.toBeNull();

        // Delete it
        await adapter.deleteMedia(uploaded.id);

        // Verify it's gone
        const afterDelete = await adapter.getMedia(uploaded.id);
        expect(afterDelete).toBeNull();
      }
    );

    it.skipIf(!supabaseUrl || !supabaseKey)(
      'should throw error for non-existent id',
      async () => {
        await expect(
          adapter.deleteMedia('00000000-0000-0000-0000-000000000000')
        ).rejects.toThrow(MediaError);
      }
    );
  });
});
