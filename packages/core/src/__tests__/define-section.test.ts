import { describe, expect, it } from 'vitest';
import { defineSection } from '../define-section';
import { fields } from '../fields';

describe('defineSection', () => {
  it('creates a section with name and schema', () => {
    const section = defineSection({
      name: 'hero',
      fields: {
        title: fields.string(),
      },
    });

    expect(section.name).toBe('hero');
    expect(section.schema).toBeDefined();
  });

  it('does not include descriptions when not provided', () => {
    const section = defineSection({
      name: 'basic',
      fields: { title: fields.string() },
    });

    expect(section.descriptions).toBeUndefined();
  });

  it('passes through descriptions', () => {
    const section = defineSection({
      name: 'hero',
      fields: {
        title: fields.string(),
        subtitle: fields.text().optional(),
      },
      descriptions: {
        title: 'Main heading',
        subtitle: 'Secondary text',
      },
    });

    expect(section.descriptions).toEqual({
      title: 'Main heading',
      subtitle: 'Secondary text',
    });
  });

  it('does not include groups when not provided', () => {
    const section = defineSection({
      name: 'basic',
      fields: { title: fields.string() },
    });

    expect(section.groups).toBeUndefined();
  });

  it('passes through groups', () => {
    const section = defineSection({
      name: 'page',
      fields: {
        title: fields.string(),
        body: fields.text(),
        image: fields.image(),
      },
      groups: [
        { name: 'Content', fields: ['title', 'body'] },
        { name: 'Media', fields: ['image'] },
      ],
    });

    expect(section.groups).toHaveLength(2);
    expect(section.groups?.[0]?.name).toBe('Content');
    expect(section.groups?.[0]?.fields).toEqual(['title', 'body']);
    expect(section.groups?.[1]?.name).toBe('Media');
  });

  it('supports group descriptions', () => {
    const section = defineSection({
      name: 'page',
      fields: {
        title: fields.string(),
      },
      groups: [
        {
          name: 'Content',
          description: 'Main content fields',
          fields: ['title'],
        },
      ],
    });

    expect(section.groups?.[0]?.description).toBe('Main content fields');
  });
});
