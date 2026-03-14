import { describe, expect, it } from 'vitest';
import type { PageSection } from '../storage/types';
import { sanitizeSectionData, sanitizeString, sanitizeValue, stripTags } from './sanitize';

describe('sanitizeString', () => {
  it('should strip script tags', () => {
    const input = '<p>Hello</p><script>alert("xss")</script>';
    expect(sanitizeString(input)).toBe('<p>Hello</p>');
  });

  it('should strip event handlers', () => {
    const input = '<p onclick="alert(1)">Click me</p>';
    expect(sanitizeString(input)).toBe('<p>Click me</p>');
  });

  it('should strip dangerous attributes', () => {
    const input = '<img src="photo.jpg" onerror="alert(1)" alt="photo">';
    expect(sanitizeString(input)).toBe('<img src="photo.jpg" alt="photo" />');
  });

  it('should preserve safe HTML unchanged', () => {
    const input = '<p>Hello <strong>world</strong></p>';
    expect(sanitizeString(input)).toBe('<p>Hello <strong>world</strong></p>');
  });

  it('should preserve all allowed tags', () => {
    const input = '<h1>Title</h1><h2>Sub</h2><h3>H3</h3><h4>H4</h4><h5>H5</h5><h6>H6</h6>';
    expect(sanitizeString(input)).toBe(input);
  });

  it('should preserve lists', () => {
    const input = '<ul><li>Item 1</li><li>Item 2</li></ul>';
    expect(sanitizeString(input)).toBe(input);
  });

  it('should preserve ordered lists', () => {
    const input = '<ol><li>First</li><li>Second</li></ol>';
    expect(sanitizeString(input)).toBe(input);
  });

  it('should preserve links with href only', () => {
    const input = '<a href="https://example.com">Link</a>';
    expect(sanitizeString(input)).toBe(input);
  });

  it('should strip non-href attributes from links', () => {
    const input = '<a href="https://example.com" target="_blank" onclick="alert(1)">Link</a>';
    expect(sanitizeString(input)).toBe('<a href="https://example.com">Link</a>');
  });

  it('should preserve em, br, blockquote, code, pre', () => {
    const input =
      '<em>italic</em><br /><blockquote>quote</blockquote><code>code</code><pre>pre</pre>';
    expect(sanitizeString(input)).toBe(input);
  });

  it('should preserve img with src and alt only', () => {
    const input = '<img src="photo.jpg" alt="A photo" />';
    expect(sanitizeString(input)).toBe(input);
  });

  it('should strip disallowed tags like iframe', () => {
    const input = '<p>Safe</p><iframe src="evil.com"></iframe>';
    expect(sanitizeString(input)).toBe('<p>Safe</p>');
  });

  it('should pass plain text through unchanged', () => {
    const input = 'Hello World';
    expect(sanitizeString(input)).toBe('Hello World');
  });

  it('should pass empty string through unchanged', () => {
    expect(sanitizeString('')).toBe('');
  });
});

describe('sanitizeValue', () => {
  it('should sanitize string values', () => {
    expect(sanitizeValue('<script>alert(1)</script>safe')).toBe('safe');
  });

  it('should pass numbers through', () => {
    expect(sanitizeValue(42)).toBe(42);
  });

  it('should pass booleans through', () => {
    expect(sanitizeValue(true)).toBe(true);
    expect(sanitizeValue(false)).toBe(false);
  });

  it('should pass null through', () => {
    expect(sanitizeValue(null)).toBe(null);
  });

  it('should pass undefined through', () => {
    expect(sanitizeValue(undefined)).toBe(undefined);
  });

  it('should recursively sanitize objects', () => {
    const input = {
      title: '<script>xss</script>Hello',
      count: 5,
      nested: {
        content: '<p>Safe</p><script>bad</script>',
        flag: true,
      },
    };

    const result = sanitizeValue(input);
    expect(result).toEqual({
      title: 'Hello',
      count: 5,
      nested: {
        content: '<p>Safe</p>',
        flag: true,
      },
    });
  });

  it('should recursively sanitize arrays', () => {
    const input = ['<script>xss</script>text', 42, { content: '<p>ok</p><script>bad</script>' }];

    const result = sanitizeValue(input);
    expect(result).toEqual(['text', 42, { content: '<p>ok</p>' }]);
  });

  it('should handle deeply nested structures', () => {
    const input = {
      level1: {
        level2: {
          level3: [{ value: '<img onerror="alert(1)" src="x.jpg" alt="test">' }],
        },
      },
    };

    const result = sanitizeValue(input) as Record<string, unknown>;
    const level1 = result.level1 as Record<string, unknown>;
    const level2 = level1.level2 as Record<string, unknown>;
    const level3 = level2.level3 as Array<Record<string, unknown>>;
    expect(level3[0].value).toBe('<img src="x.jpg" alt="test" />');
  });
});

describe('sanitizeSectionData', () => {
  it('should sanitize all string values in section data', () => {
    const sections: PageSection[] = [
      {
        id: 's1',
        type: 'hero',
        data: {
          title: '<script>alert("xss")</script>Welcome',
          subtitle: '<p>Hello <strong>world</strong></p>',
        },
      },
    ];

    const result = sanitizeSectionData(sections);
    expect(result[0].data.title).toBe('Welcome');
    expect(result[0].data.subtitle).toBe('<p>Hello <strong>world</strong></p>');
  });

  it('should not mutate the original sections', () => {
    const sections: PageSection[] = [
      {
        id: 's1',
        type: 'hero',
        data: { title: '<script>xss</script>Hello' },
      },
    ];

    const result = sanitizeSectionData(sections);
    expect(result[0].data.title).toBe('Hello');
    expect(sections[0].data.title).toBe('<script>xss</script>Hello');
  });

  it('should preserve section id and type', () => {
    const sections: PageSection[] = [{ id: 's1', type: 'hero', data: { title: 'Hello' } }];

    const result = sanitizeSectionData(sections);
    expect(result[0].id).toBe('s1');
    expect(result[0].type).toBe('hero');
  });

  it('should handle empty sections array', () => {
    expect(sanitizeSectionData([])).toEqual([]);
  });

  it('should handle nested objects and arrays in section data', () => {
    const sections: PageSection[] = [
      {
        id: 's1',
        type: 'gallery',
        data: {
          items: [
            { caption: '<script>xss</script>Photo 1', url: 'img1.jpg' },
            { caption: '<p>Photo 2</p>', url: 'img2.jpg' },
          ],
          metadata: {
            description: '<p>Gallery</p><iframe src="evil.com"></iframe>',
          },
        },
      },
    ];

    const result = sanitizeSectionData(sections);
    const items = result[0].data.items as Array<Record<string, unknown>>;
    expect(items[0].caption).toBe('Photo 1');
    expect(items[0].url).toBe('img1.jpg');
    expect(items[1].caption).toBe('<p>Photo 2</p>');
    const metadata = result[0].data.metadata as Record<string, unknown>;
    expect(metadata.description).toBe('<p>Gallery</p>');
  });
});

describe('stripTags', () => {
  it('should remove all HTML tags', () => {
    const input = '<p>Hello <strong>world</strong></p>';
    expect(stripTags(input)).toBe('Hello world');
  });

  it('should remove script tags and content', () => {
    const input = '<script>alert("xss")</script>Hello';
    expect(stripTags(input)).toBe('Hello');
  });

  it('should remove all tags from complex HTML', () => {
    const input = '<div><h1>Title</h1><p>Text</p><a href="link">Link</a></div>';
    expect(stripTags(input)).toBe('TitleTextLink');
  });

  it('should preserve plain text', () => {
    const input = 'Plain text without tags';
    expect(stripTags(input)).toBe('Plain text without tags');
  });

  it('should handle empty string', () => {
    expect(stripTags('')).toBe('');
  });

  it('should remove img tags', () => {
    const input = 'Before <img src="photo.jpg" alt="test" /> After';
    expect(stripTags(input)).toBe('Before  After');
  });

  it('should remove event handlers', () => {
    const input = '<div onclick="alert(1)">Click me</div>';
    expect(stripTags(input)).toBe('Click me');
  });

  it('should handle self-closing tags', () => {
    const input = 'Line 1<br />Line 2';
    expect(stripTags(input)).toBe('Line 1Line 2');
  });

  it('should remove nested tags', () => {
    const input = '<div><p><span>Nested</span> text</p></div>';
    expect(stripTags(input)).toBe('Nested text');
  });
});
