import { describe, expect, expectTypeOf, it } from 'vitest';
import type {
  AllowedMimeType,
  MediaAdapter,
  MediaFile,
  MediaFilter,
  UploadMediaInput,
} from './types';
import { ALLOWED_MIME_TYPES } from './types';

describe('Media Types', () => {
  describe('MediaFile', () => {
    it('should have correct structure', () => {
      const mediaFile: MediaFile = {
        id: '123',
        filename: 'test.jpg',
        url: 'https://example.com/test.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        createdAt: new Date(),
      };

      expect(mediaFile.id).toBe('123');
      expect(mediaFile.filename).toBe('test.jpg');
      expect(mediaFile.url).toBe('https://example.com/test.jpg');
      expect(mediaFile.mimeType).toBe('image/jpeg');
      expect(mediaFile.size).toBe(1024);
      expect(mediaFile.createdAt).toBeInstanceOf(Date);
    });

    it('should have correct type definitions', () => {
      expectTypeOf<MediaFile>().toHaveProperty('id');
      expectTypeOf<MediaFile>().toHaveProperty('filename');
      expectTypeOf<MediaFile>().toHaveProperty('url');
      expectTypeOf<MediaFile>().toHaveProperty('mimeType');
      expectTypeOf<MediaFile>().toHaveProperty('size');
      expectTypeOf<MediaFile>().toHaveProperty('createdAt');
    });
  });

  describe('UploadMediaInput', () => {
    it('should accept ArrayBuffer data', () => {
      const input: UploadMediaInput = {
        filename: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        data: new ArrayBuffer(1024),
      };

      expect(input.filename).toBe('test.jpg');
      expect(input.data).toBeInstanceOf(ArrayBuffer);
    });

    it('should accept Uint8Array data', () => {
      const input: UploadMediaInput = {
        filename: 'test.png',
        mimeType: 'image/png',
        size: 512,
        data: new Uint8Array(512),
      };

      expect(input.filename).toBe('test.png');
      expect(input.data).toBeInstanceOf(Uint8Array);
    });
  });

  describe('MediaFilter', () => {
    it('should allow optional properties', () => {
      const emptyFilter: MediaFilter = {};
      const limitFilter: MediaFilter = { limit: 10 };
      const fullFilter: MediaFilter = {
        limit: 10,
        offset: 20,
        mimeType: 'image/jpeg',
      };

      expect(emptyFilter).toEqual({});
      expect(limitFilter.limit).toBe(10);
      expect(fullFilter.offset).toBe(20);
    });
  });

  describe('ALLOWED_MIME_TYPES', () => {
    it('should contain expected image types', () => {
      expect(ALLOWED_MIME_TYPES).toContain('image/jpeg');
      expect(ALLOWED_MIME_TYPES).toContain('image/png');
      expect(ALLOWED_MIME_TYPES).toContain('image/gif');
      expect(ALLOWED_MIME_TYPES).toContain('image/webp');
      expect(ALLOWED_MIME_TYPES).toContain('image/svg+xml');
    });

    it('should have correct length', () => {
      expect(ALLOWED_MIME_TYPES).toHaveLength(5);
    });
  });

  describe('AllowedMimeType', () => {
    it('should be a union of allowed types', () => {
      const jpeg: AllowedMimeType = 'image/jpeg';
      const png: AllowedMimeType = 'image/png';
      const gif: AllowedMimeType = 'image/gif';
      const webp: AllowedMimeType = 'image/webp';
      const svg: AllowedMimeType = 'image/svg+xml';

      expect(jpeg).toBe('image/jpeg');
      expect(png).toBe('image/png');
      expect(gif).toBe('image/gif');
      expect(webp).toBe('image/webp');
      expect(svg).toBe('image/svg+xml');
    });
  });

  describe('MediaAdapter', () => {
    it('should define all required methods', () => {
      const mockAdapter: MediaAdapter = {
        upload: async () => ({
          id: '1',
          filename: 'test.jpg',
          url: 'https://example.com/test.jpg',
          mimeType: 'image/jpeg',
          size: 1024,
          createdAt: new Date(),
        }),
        getMedia: async () => null,
        listMedia: async () => [],
        deleteMedia: async () => {},
      };

      expect(mockAdapter.upload).toBeDefined();
      expect(mockAdapter.getMedia).toBeDefined();
      expect(mockAdapter.listMedia).toBeDefined();
      expect(mockAdapter.deleteMedia).toBeDefined();
    });

    it('should have correct method signatures', () => {
      expectTypeOf<MediaAdapter['upload']>().toBeFunction();
      expectTypeOf<MediaAdapter['getMedia']>().toBeFunction();
      expectTypeOf<MediaAdapter['listMedia']>().toBeFunction();
      expectTypeOf<MediaAdapter['deleteMedia']>().toBeFunction();
    });

    it('should return correct types from methods', () => {
      expectTypeOf<MediaAdapter['upload']>().returns.toMatchTypeOf<Promise<MediaFile>>();
      expectTypeOf<MediaAdapter['getMedia']>().returns.toMatchTypeOf<Promise<MediaFile | null>>();
      expectTypeOf<MediaAdapter['listMedia']>().returns.toMatchTypeOf<Promise<MediaFile[]>>();
      expectTypeOf<MediaAdapter['deleteMedia']>().returns.toMatchTypeOf<Promise<void>>();
    });
  });
});
