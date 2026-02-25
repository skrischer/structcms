import { createClient } from '@supabase/supabase-js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  MediaValidationError,
  handleDeleteMedia,
  handleGetMedia,
  handleListMedia,
  handleUploadMedia,
} from './handlers';
import { SupabaseMediaAdapter } from './supabase-adapter';
import type { MediaFile } from './types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

describe('Media Handlers', () => {
  const testPrefix = `handler-test-${Date.now()}`;
  let adapter: SupabaseMediaAdapter;
  const uploadedMediaIds: string[] = [];

  beforeAll(() => {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Skipping handler tests: Missing Supabase credentials');
      return;
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    adapter = new SupabaseMediaAdapter({ client: supabase });
  });

  afterAll(async () => {
    if (!adapter) return;
    for (const id of uploadedMediaIds) {
      try {
        await adapter.deleteMedia(id);
      } catch {
        // Ignore cleanup errors
      }
    }
  });

  describe('handleUploadMedia', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)('should upload a valid image file', async () => {
      const testData = new TextEncoder().encode('test image content');

      const result = await handleUploadMedia(adapter, {
        filename: `${testPrefix}-upload.jpg`,
        mimeType: 'image/jpeg',
        size: testData.length,
        data: testData,
      });

      uploadedMediaIds.push(result.id);

      expect(result.id).toBeDefined();
      expect(result.filename).toBe(`${testPrefix}-upload.jpg`);
      expect(result.url).toContain('supabase');
      expect(result.mimeType).toBe('image/jpeg');
      expect(result.size).toBe(testData.length);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it.skipIf(!supabaseUrl || !supabaseKey)('should accept all allowed MIME types', async () => {
      const allowedTypes = [
        { ext: 'png', mime: 'image/png' },
        { ext: 'gif', mime: 'image/gif' },
        { ext: 'webp', mime: 'image/webp' },
        { ext: 'svg', mime: 'image/svg+xml' },
      ];

      for (const { ext, mime } of allowedTypes) {
        const testData = new TextEncoder().encode(`test ${ext} content`);
        const result = await handleUploadMedia(adapter, {
          filename: `${testPrefix}-type.${ext}`,
          mimeType: mime,
          size: testData.length,
          data: testData,
        });
        uploadedMediaIds.push(result.id);
        expect(result.mimeType).toBe(mime);
      }
    });

    it.skipIf(!supabaseUrl || !supabaseKey)('should reject invalid MIME types', async () => {
      const testData = new TextEncoder().encode('test content');

      await expect(
        handleUploadMedia(adapter, {
          filename: `${testPrefix}-invalid.pdf`,
          mimeType: 'application/pdf',
          size: testData.length,
          data: testData,
        })
      ).rejects.toThrow(MediaValidationError);
    });

    it.skipIf(!supabaseUrl || !supabaseKey)('should reject text/plain MIME type', async () => {
      const testData = new TextEncoder().encode('plain text');

      await expect(
        handleUploadMedia(adapter, {
          filename: `${testPrefix}-text.txt`,
          mimeType: 'text/plain',
          size: testData.length,
          data: testData,
        })
      ).rejects.toThrow('Invalid file type');
    });
  });

  describe('handleGetMedia', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)('should retrieve uploaded media', async () => {
      const testData = new TextEncoder().encode('get handler test');
      const uploaded = await handleUploadMedia(adapter, {
        filename: `${testPrefix}-get.png`,
        mimeType: 'image/png',
        size: testData.length,
        data: testData,
      });
      uploadedMediaIds.push(uploaded.id);

      const retrieved = await handleGetMedia(adapter, uploaded.id);

      expect(retrieved).not.toBeNull();
      const media = retrieved as MediaFile;
      expect(media.id).toBe(uploaded.id);
      expect(media.filename).toBe(`${testPrefix}-get.png`);
    });

    it.skipIf(!supabaseUrl || !supabaseKey)('should return null for non-existent id', async () => {
      const result = await handleGetMedia(adapter, '00000000-0000-0000-0000-000000000000');
      expect(result).toBeNull();
    });
  });

  describe('handleListMedia', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)('should list media files', async () => {
      const testData = new TextEncoder().encode('list handler test');
      await handleUploadMedia(adapter, {
        filename: `${testPrefix}-list.gif`,
        mimeType: 'image/gif',
        size: testData.length,
        data: testData,
      }).then((r) => uploadedMediaIds.push(r.id));

      const list = await handleListMedia(adapter);

      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeGreaterThanOrEqual(1);
    });

    it.skipIf(!supabaseUrl || !supabaseKey)('should support pagination', async () => {
      const list = await handleListMedia(adapter, { limit: 2 });
      expect(list.length).toBeLessThanOrEqual(2);
    });
  });

  describe('handleDeleteMedia', () => {
    it.skipIf(!supabaseUrl || !supabaseKey)('should delete media', async () => {
      const testData = new TextEncoder().encode('delete handler test');
      const uploaded = await handleUploadMedia(adapter, {
        filename: `${testPrefix}-delete.webp`,
        mimeType: 'image/webp',
        size: testData.length,
        data: testData,
      });

      await handleDeleteMedia(adapter, uploaded.id);

      const retrieved = await handleGetMedia(adapter, uploaded.id);
      expect(retrieved).toBeNull();
    });
  });
});
