import { describe, it, expect } from 'vitest';
import { generateSlug, ensureUniqueSlug } from './slug';

describe('generateSlug', () => {
  it('should convert title to lowercase', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('should replace spaces with hyphens', () => {
    expect(generateSlug('hello world')).toBe('hello-world');
  });

  it('should handle multiple spaces', () => {
    expect(generateSlug('hello   world')).toBe('hello-world');
  });

  it('should trim leading and trailing spaces', () => {
    expect(generateSlug('  hello world  ')).toBe('hello-world');
  });

  it('should replace underscores with hyphens', () => {
    expect(generateSlug('hello_world')).toBe('hello-world');
  });

  it('should remove special characters', () => {
    expect(generateSlug('hello! world?')).toBe('hello-world');
    expect(generateSlug('hello@world#test')).toBe('helloworldtest');
  });

  it('should handle German umlauts', () => {
    expect(generateSlug('Über uns')).toBe('ueber-uns');
    expect(generateSlug('Größe')).toBe('groesse');
    expect(generateSlug('Äpfel und Öl')).toBe('aepfel-und-oel');
  });

  it('should handle ß', () => {
    expect(generateSlug('Straße')).toBe('strasse');
    expect(generateSlug('Fußball')).toBe('fussball');
  });

  it('should remove multiple consecutive hyphens', () => {
    expect(generateSlug('hello---world')).toBe('hello-world');
    expect(generateSlug('hello - - world')).toBe('hello-world');
  });

  it('should remove leading and trailing hyphens', () => {
    expect(generateSlug('-hello-world-')).toBe('hello-world');
    expect(generateSlug('---hello---')).toBe('hello');
  });

  it('should handle numbers', () => {
    expect(generateSlug('Page 1')).toBe('page-1');
    expect(generateSlug('2024 News')).toBe('2024-news');
  });

  it('should handle empty string', () => {
    expect(generateSlug('')).toBe('');
  });

  it('should handle string with only special characters', () => {
    expect(generateSlug('!@#$%')).toBe('');
  });
});

describe('ensureUniqueSlug', () => {
  it('should return original slug if unique', () => {
    expect(ensureUniqueSlug('hello', ['world', 'foo'])).toBe('hello');
  });

  it('should return original slug if existingSlugs is empty', () => {
    expect(ensureUniqueSlug('hello', [])).toBe('hello');
  });

  it('should append -1 if slug exists', () => {
    expect(ensureUniqueSlug('hello', ['hello'])).toBe('hello-1');
  });

  it('should append -2 if slug and slug-1 exist', () => {
    expect(ensureUniqueSlug('hello', ['hello', 'hello-1'])).toBe('hello-2');
  });

  it('should find next available number', () => {
    expect(
      ensureUniqueSlug('page', ['page', 'page-1', 'page-2', 'page-3'])
    ).toBe('page-4');
  });

  it('should handle gaps in numbering', () => {
    expect(ensureUniqueSlug('test', ['test', 'test-1', 'test-3'])).toBe(
      'test-2'
    );
  });

  it('should not confuse similar slugs', () => {
    expect(ensureUniqueSlug('hello', ['hello-world', 'hello-there'])).toBe(
      'hello'
    );
  });
});
