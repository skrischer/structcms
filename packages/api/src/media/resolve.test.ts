import { describe, expect, it } from 'vitest';
import type { PageSection } from '../storage/types';
import { resolveMediaReferences } from './resolve';
import type { MediaAdapter } from './types';

function createMockAdapter(mediaMap: Record<string, string>): MediaAdapter {
  return {
    upload: async () => {
      throw new Error('Not implemented');
    },
    getMedia: async (id: string) => {
      const url = mediaMap[id];
      if (!url) return null;
      return {
        id,
        filename: `${id}.jpg`,
        url,
        mimeType: 'image/jpeg',
        size: 1024,
        createdAt: new Date(),
      };
    },
    listMedia: async () => [],
    deleteMedia: async () => {},
  };
}

describe('resolveMediaReferences', () => {
  const mediaId1 = '11111111-1111-1111-1111-111111111111';
  const mediaId2 = '22222222-2222-2222-2222-222222222222';
  const missingId = '99999999-9999-9999-9999-999999999999';

  const mockAdapter = createMockAdapter({
    [mediaId1]: 'https://cdn.example.com/image1.jpg',
    [mediaId2]: 'https://cdn.example.com/image2.png',
  });

  it('should resolve "image" field to URL', async () => {
    const sections: PageSection[] = [
      {
        id: 'hero-1',
        type: 'hero',
        data: { title: 'Welcome', image: mediaId1 },
      },
    ];

    const resolved = await resolveMediaReferences(sections, mockAdapter);

    expect(resolved[0].data.image).toBe('https://cdn.example.com/image1.jpg');
    expect(resolved[0].data.title).toBe('Welcome');
  });

  it('should resolve "thumbnail" field to URL', async () => {
    const sections: PageSection[] = [
      {
        id: 'card-1',
        type: 'card',
        data: { text: 'Hello', thumbnail: mediaId2 },
      },
    ];

    const resolved = await resolveMediaReferences(sections, mockAdapter);

    expect(resolved[0].data.thumbnail).toBe('https://cdn.example.com/image2.png');
  });

  it('should resolve fields ending with _image suffix', async () => {
    const sections: PageSection[] = [
      {
        id: 'banner-1',
        type: 'banner',
        data: { hero_image: mediaId1, background_image: mediaId2 },
      },
    ];

    const resolved = await resolveMediaReferences(sections, mockAdapter);

    expect(resolved[0].data.hero_image).toBe('https://cdn.example.com/image1.jpg');
    expect(resolved[0].data.background_image).toBe('https://cdn.example.com/image2.png');
  });

  it('should resolve null for missing media', async () => {
    const sections: PageSection[] = [
      {
        id: 'hero-1',
        type: 'hero',
        data: { image: missingId },
      },
    ];

    const resolved = await resolveMediaReferences(sections, mockAdapter);

    expect(resolved[0].data.image).toBeNull();
  });

  it('should not modify non-media fields', async () => {
    const sections: PageSection[] = [
      {
        id: 'text-1',
        type: 'text',
        data: {
          title: 'Hello',
          description: 'Some text',
          count: 42,
        },
      },
    ];

    const resolved = await resolveMediaReferences(sections, mockAdapter);

    expect(resolved[0].data.title).toBe('Hello');
    expect(resolved[0].data.description).toBe('Some text');
    expect(resolved[0].data.count).toBe(42);
  });

  it('should not resolve non-UUID strings in media fields', async () => {
    const sections: PageSection[] = [
      {
        id: 'hero-1',
        type: 'hero',
        data: { image: 'not-a-uuid', title: 'Test' },
      },
    ];

    const resolved = await resolveMediaReferences(sections, mockAdapter);

    expect(resolved[0].data.image).toBe('not-a-uuid');
  });

  it('should resolve nested media references', async () => {
    const sections: PageSection[] = [
      {
        id: 'nested-1',
        type: 'nested',
        data: {
          content: {
            image: mediaId1,
            label: 'Nested label',
          },
        },
      },
    ];

    const resolved = await resolveMediaReferences(sections, mockAdapter);

    const content = resolved[0].data.content as Record<string, unknown>;
    expect(content.image).toBe('https://cdn.example.com/image1.jpg');
    expect(content.label).toBe('Nested label');
  });

  it('should handle multiple sections', async () => {
    const sections: PageSection[] = [
      {
        id: 'hero-1',
        type: 'hero',
        data: { image: mediaId1 },
      },
      {
        id: 'card-1',
        type: 'card',
        data: { thumbnail: mediaId2 },
      },
    ];

    const resolved = await resolveMediaReferences(sections, mockAdapter);

    expect(resolved[0].data.image).toBe('https://cdn.example.com/image1.jpg');
    expect(resolved[1].data.thumbnail).toBe('https://cdn.example.com/image2.png');
  });

  it('should handle empty sections', async () => {
    const resolved = await resolveMediaReferences([], mockAdapter);
    expect(resolved).toEqual([]);
  });

  it('should not mutate original sections', async () => {
    const sections: PageSection[] = [
      {
        id: 'hero-1',
        type: 'hero',
        data: { image: mediaId1, title: 'Original' },
      },
    ];

    const resolved = await resolveMediaReferences(sections, mockAdapter);

    expect(sections[0].data.image).toBe(mediaId1);
    expect(resolved[0].data.image).toBe('https://cdn.example.com/image1.jpg');
  });

  it('should resolve "media", "photo", "avatar", "icon" fields', async () => {
    const sections: PageSection[] = [
      {
        id: 'profile-1',
        type: 'profile',
        data: {
          media: mediaId1,
          photo: mediaId2,
          avatar: mediaId1,
          icon: mediaId2,
        },
      },
    ];

    const resolved = await resolveMediaReferences(sections, mockAdapter);

    expect(resolved[0].data.media).toBe('https://cdn.example.com/image1.jpg');
    expect(resolved[0].data.photo).toBe('https://cdn.example.com/image2.png');
    expect(resolved[0].data.avatar).toBe('https://cdn.example.com/image1.jpg');
    expect(resolved[0].data.icon).toBe('https://cdn.example.com/image2.png');
  });
});
