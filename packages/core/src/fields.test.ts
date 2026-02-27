import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { fields, getFieldMeta, isFieldType } from './fields';

describe('fields', () => {
  describe('string', () => {
    it('should create a string schema with metadata', () => {
      const schema = fields.string();
      expect(schema.safeParse('hello').success).toBe(true);
      expect(getFieldMeta(schema)?.fieldType).toBe('string');
    });

    it('should support chained validations', () => {
      const schema = fields.string().min(1).max(10);
      expect(schema.safeParse('').success).toBe(false);
      expect(schema.safeParse('hello').success).toBe(true);
      expect(schema.safeParse('this is too long').success).toBe(false);
    });
  });

  describe('text', () => {
    it('should create a text schema with metadata', () => {
      const schema = fields.text();
      expect(schema.safeParse('long text content').success).toBe(true);
      expect(getFieldMeta(schema)?.fieldType).toBe('text');
    });
  });

  describe('richtext', () => {
    it('should create a richtext schema with metadata', () => {
      const schema = fields.richtext();
      expect(schema.safeParse('<p>HTML content</p>').success).toBe(true);
      expect(getFieldMeta(schema)?.fieldType).toBe('richtext');
    });
  });

  describe('image', () => {
    it('should create an image schema with metadata', () => {
      const schema = fields.image();
      expect(schema.safeParse('media-id-123').success).toBe(true);
      expect(schema.safeParse('https://example.com/image.jpg').success).toBe(true);
      expect(getFieldMeta(schema)?.fieldType).toBe('image');
    });
  });

  describe('reference', () => {
    it('should create a reference schema with metadata', () => {
      const schema = fields.reference();
      expect(schema.safeParse('page-slug').success).toBe(true);
      expect(getFieldMeta(schema)?.fieldType).toBe('reference');
    });
  });

  describe('array', () => {
    it('should create an array schema with metadata', () => {
      const schema = fields.array(z.string());
      expect(schema.safeParse(['a', 'b', 'c']).success).toBe(true);
      expect(schema.safeParse([1, 2, 3]).success).toBe(false);
      expect(getFieldMeta(schema)?.fieldType).toBe('array');
    });

    it('should work with complex item schemas', () => {
      const schema = fields.array(
        z.object({
          title: z.string(),
          url: z.string().url(),
        })
      );
      const result = schema.safeParse([{ title: 'Link 1', url: 'https://example.com' }]);
      expect(result.success).toBe(true);
    });
  });

  describe('object', () => {
    it('should create an object schema with metadata', () => {
      const schema = fields.object({
        label: z.string(),
        href: z.string(),
      });
      expect(schema.safeParse({ label: 'Click', href: '/page' }).success).toBe(true);
      expect(getFieldMeta(schema)?.fieldType).toBe('object');
    });
  });
});

describe('getFieldMeta', () => {
  it('should return null for schemas without metadata', () => {
    const schema = z.string();
    expect(getFieldMeta(schema)).toBeNull();
  });

  it('should return null for schemas with non-field descriptions', () => {
    const schema = z.string().describe('Just a regular description');
    expect(getFieldMeta(schema)).toBeNull();
  });

  it('should extract metadata from field schemas', () => {
    const schema = fields.richtext();
    const meta = getFieldMeta(schema);
    expect(meta).not.toBeNull();
    expect(meta?.fieldType).toBe('richtext');
    expect(meta?.version).toBe(1);
  });

  it('should include version 1 in new field metadata', () => {
    const schema = fields.string();
    const meta = getFieldMeta(schema);
    expect(meta).not.toBeNull();
    expect(meta?.version).toBe(1);
  });

  it('should assume version 1 for legacy metadata without version (backward compatibility)', () => {
    // Simulate old metadata format without version
    const legacyMeta = '__structcms_field__{"fieldType":"text"}';
    const schema = z.string().describe(legacyMeta);
    const meta = getFieldMeta(schema);
    expect(meta).not.toBeNull();
    expect(meta?.version).toBe(1);
    expect(meta?.fieldType).toBe('text');
  });
});

describe('isFieldType', () => {
  it('should return true for matching field type', () => {
    expect(isFieldType(fields.string(), 'string')).toBe(true);
    expect(isFieldType(fields.text(), 'text')).toBe(true);
    expect(isFieldType(fields.richtext(), 'richtext')).toBe(true);
    expect(isFieldType(fields.image(), 'image')).toBe(true);
    expect(isFieldType(fields.reference(), 'reference')).toBe(true);
  });

  it('should return false for non-matching field type', () => {
    expect(isFieldType(fields.string(), 'text')).toBe(false);
    expect(isFieldType(fields.text(), 'richtext')).toBe(false);
  });

  it('should return false for schemas without metadata', () => {
    expect(isFieldType(z.string(), 'string')).toBe(false);
  });
});
