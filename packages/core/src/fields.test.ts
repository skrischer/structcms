import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { fields, getFieldMeta, isFieldType, visibleWhen } from './fields';

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

    it('should create richtext without config (backward compatible)', () => {
      const schema = fields.richtext();
      expect(getFieldMeta(schema)?.fieldType).toBe('richtext');
      expect(getFieldMeta(schema)?.allowedBlocks).toBeUndefined();
    });

    it('should store allowedBlocks in metadata', () => {
      const schema = fields.richtext({ allowedBlocks: ['paragraph', 'heading2', 'link'] });
      const meta = getFieldMeta(schema);
      expect(meta?.fieldType).toBe('richtext');
      expect(meta?.allowedBlocks).toEqual(['paragraph', 'heading2', 'link']);
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

  describe('boolean', () => {
    it('should create a boolean schema with metadata', () => {
      const schema = fields.boolean();
      expect(schema.safeParse(true).success).toBe(true);
      expect(schema.safeParse(false).success).toBe(true);
      expect(schema.safeParse('true').success).toBe(false);
      expect(getFieldMeta(schema)?.fieldType).toBe('boolean');
    });
  });

  describe('file', () => {
    it('should create a file schema with metadata', () => {
      const schema = fields.file();
      expect(schema.safeParse('media-id-456').success).toBe(true);
      expect(schema.safeParse('https://example.com/document.pdf').success).toBe(true);
      expect(getFieldMeta(schema)?.fieldType).toBe('file');
    });
  });

  describe('url', () => {
    it('should create a url schema with metadata', () => {
      const schema = fields.url();
      expect(schema.safeParse('https://example.com').success).toBe(true);
      expect(schema.safeParse('not-a-url').success).toBe(false);
      expect(getFieldMeta(schema)?.fieldType).toBe('url');
    });
  });

  describe('select', () => {
    it('should create a select schema with metadata and options', () => {
      const schema = fields.select({ options: ['static', 'overlay'] as const });
      expect(schema.safeParse('static').success).toBe(true);
      expect(schema.safeParse('overlay').success).toBe(true);
      expect(schema.safeParse('invalid').success).toBe(false);
      expect(getFieldMeta(schema)?.fieldType).toBe('select');
    });

    it('should store options in metadata', () => {
      const schema = fields.select({ options: ['a', 'b', 'c'] as const });
      const meta = getFieldMeta(schema);
      expect(meta?.options).toEqual(['a', 'b', 'c']);
    });

    it('should validate only allowed options', () => {
      const schema = fields.select({ options: ['red', 'green', 'blue'] as const });
      expect(schema.safeParse('red').success).toBe(true);
      expect(schema.safeParse('yellow').success).toBe(false);
      expect(schema.safeParse(123).success).toBe(false);
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

describe('visibleWhen', () => {
  it('should add visibleWhen to field metadata', () => {
    const schema = visibleWhen(fields.string(), 'variant', 'overlay');
    const meta = getFieldMeta(schema);
    expect(meta?.fieldType).toBe('string');
    expect(meta?.visibleWhen).toEqual({ field: 'variant', values: ['overlay'] });
  });

  it('should support array of values', () => {
    const schema = visibleWhen(fields.string(), 'variant', ['overlay', 'hero']);
    const meta = getFieldMeta(schema);
    expect(meta?.visibleWhen).toEqual({ field: 'variant', values: ['overlay', 'hero'] });
  });

  it('should preserve existing options metadata', () => {
    const schema = visibleWhen(fields.select({ options: ['a', 'b'] as const }), 'mode', 'advanced');
    const meta = getFieldMeta(schema);
    expect(meta?.fieldType).toBe('select');
    expect(meta?.options).toEqual(['a', 'b']);
    expect(meta?.visibleWhen).toEqual({ field: 'mode', values: ['advanced'] });
  });

  it('should return schema unchanged if no metadata', () => {
    const schema = z.string();
    const result = visibleWhen(schema, 'field', 'value');
    expect(getFieldMeta(result)).toBeNull();
  });
});

describe('isFieldType', () => {
  it('should return true for matching field type', () => {
    expect(isFieldType(fields.string(), 'string')).toBe(true);
    expect(isFieldType(fields.text(), 'text')).toBe(true);
    expect(isFieldType(fields.richtext(), 'richtext')).toBe(true);
    expect(isFieldType(fields.image(), 'image')).toBe(true);
    expect(isFieldType(fields.reference(), 'reference')).toBe(true);
    expect(isFieldType(fields.boolean(), 'boolean')).toBe(true);
    expect(isFieldType(fields.select({ options: ['a', 'b'] as const }), 'select')).toBe(true);
    expect(isFieldType(fields.file(), 'file')).toBe(true);
    expect(isFieldType(fields.url(), 'url')).toBe(true);
  });

  it('should return false for non-matching field type', () => {
    expect(isFieldType(fields.string(), 'text')).toBe(false);
    expect(isFieldType(fields.text(), 'richtext')).toBe(false);
  });

  it('should return false for schemas without metadata', () => {
    expect(isFieldType(z.string(), 'string')).toBe(false);
  });
});
