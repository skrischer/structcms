import { describe, expect, it } from 'vitest';
import {
  CreateNavigationSchema,
  CreatePageSchema,
  MAX_FILE_SIZE,
  MediaUploadSchema,
  SignInSchema,
  UpdateNavigationSchema,
  UpdatePageSchema,
} from './schemas';

describe('Validation Schemas', () => {
  describe('CreatePageSchema', () => {
    it('should validate a valid page', () => {
      const validPage = {
        title: 'Test Page',
        pageType: 'standard',
      };

      const result = CreatePageSchema.safeParse(validPage);
      expect(result.success).toBe(true);
    });

    it('should validate a page with slug and sections', () => {
      const validPage = {
        title: 'Test Page',
        pageType: 'standard',
        slug: 'test-page',
        sections: [
          {
            type: 'hero',
            data: { title: 'Hero Title' },
          },
        ],
      };

      const result = CreatePageSchema.safeParse(validPage);
      expect(result.success).toBe(true);
    });

    it('should reject title exceeding 200 characters', () => {
      const invalidPage = {
        title: 'x'.repeat(201),
        pageType: 'standard',
      };

      const result = CreatePageSchema.safeParse(invalidPage);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('200 characters');
      }
    });

    it('should reject slug exceeding 200 characters', () => {
      const invalidPage = {
        title: 'Test',
        pageType: 'standard',
        slug: 'x'.repeat(201),
      };

      const result = CreatePageSchema.safeParse(invalidPage);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('200 characters');
      }
    });

    it('should reject missing required fields', () => {
      const invalidPage = {
        title: 'Test',
      };

      const result = CreatePageSchema.safeParse(invalidPage);
      expect(result.success).toBe(false);
    });
  });

  describe('UpdatePageSchema', () => {
    it('should validate partial updates', () => {
      const validUpdate = {
        title: 'Updated Title',
      };

      const result = UpdatePageSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should validate empty update', () => {
      const result = UpdatePageSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should reject invalid title length', () => {
      const invalidUpdate = {
        title: 'x'.repeat(201),
      };

      const result = UpdatePageSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });

  describe('CreateNavigationSchema', () => {
    it('should validate a valid navigation', () => {
      const validNav = {
        name: 'Main Menu',
        items: [
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
        ],
      };

      const result = CreateNavigationSchema.safeParse(validNav);
      expect(result.success).toBe(true);
    });

    it('should validate navigation with nested children', () => {
      const validNav = {
        name: 'Main Menu',
        items: [
          {
            label: 'Products',
            href: '/products',
            children: [
              { label: 'Category 1', href: '/products/cat1' },
              { label: 'Category 2', href: '/products/cat2' },
            ],
          },
        ],
      };

      const result = CreateNavigationSchema.safeParse(validNav);
      expect(result.success).toBe(true);
    });

    it('should reject name exceeding 100 characters', () => {
      const invalidNav = {
        name: 'x'.repeat(101),
        items: [{ label: 'Home', href: '/' }],
      };

      const result = CreateNavigationSchema.safeParse(invalidNav);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('100 characters');
      }
    });

    it('should reject missing required fields', () => {
      const invalidNav = {
        name: 'Test',
      };

      const result = CreateNavigationSchema.safeParse(invalidNav);
      expect(result.success).toBe(false);
    });

    it('should reject invalid navigation items', () => {
      const invalidNav = {
        name: 'Main Menu',
        items: [{ label: 'Home' }], // missing href
      };

      const result = CreateNavigationSchema.safeParse(invalidNav);
      expect(result.success).toBe(false);
    });
  });

  describe('UpdateNavigationSchema', () => {
    it('should validate partial updates', () => {
      const validUpdate = {
        name: 'Updated Menu',
      };

      const result = UpdateNavigationSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should validate empty update', () => {
      const result = UpdateNavigationSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('SignInSchema', () => {
    it('should validate valid sign in credentials', () => {
      const validSignIn = {
        email: 'user@example.com',
        password: 'password123',
      };

      const result = SignInSchema.safeParse(validSignIn);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidSignIn = {
        email: 'not-an-email',
        password: 'password123',
      };

      const result = SignInSchema.safeParse(invalidSignIn);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('email');
      }
    });

    it('should reject empty password', () => {
      const invalidSignIn = {
        email: 'user@example.com',
        password: '',
      };

      const result = SignInSchema.safeParse(invalidSignIn);
      expect(result.success).toBe(false);
    });

    it('should reject missing fields', () => {
      const invalidSignIn = {
        email: 'user@example.com',
      };

      const result = SignInSchema.safeParse(invalidSignIn);
      expect(result.success).toBe(false);
    });
  });

  describe('MediaUploadSchema', () => {
    it('should validate valid media upload', () => {
      const validUpload = {
        filename: 'image.jpg',
        mimeType: 'image/jpeg',
        size: 1024 * 1024, // 1MB
        data: new ArrayBuffer(1024),
      };

      const result = MediaUploadSchema.safeParse(validUpload);
      expect(result.success).toBe(true);
    });

    it('should reject filename exceeding 255 characters', () => {
      const invalidUpload = {
        filename: `${'x'.repeat(256)}.jpg`,
        mimeType: 'image/jpeg',
        size: 1024,
        data: new ArrayBuffer(1024),
      };

      const result = MediaUploadSchema.safeParse(invalidUpload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('255 characters');
      }
    });

    it('should reject file size exceeding MAX_FILE_SIZE', () => {
      const invalidUpload = {
        filename: 'large-file.bin',
        mimeType: 'application/octet-stream',
        size: MAX_FILE_SIZE + 1,
        data: new ArrayBuffer(1024),
      };

      const result = MediaUploadSchema.safeParse(invalidUpload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('50MB');
      }
    });

    it('should accept file exactly at MAX_FILE_SIZE', () => {
      const validUpload = {
        filename: 'max-size-file.bin',
        mimeType: 'application/octet-stream',
        size: MAX_FILE_SIZE,
        data: new ArrayBuffer(1024),
      };

      const result = MediaUploadSchema.safeParse(validUpload);
      expect(result.success).toBe(true);
    });

    it('should reject non-ArrayBuffer data', () => {
      const invalidUpload = {
        filename: 'file.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        data: 'not an array buffer',
      };

      const result = MediaUploadSchema.safeParse(invalidUpload);
      expect(result.success).toBe(false);
    });
  });
});
