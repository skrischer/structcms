import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock global fetch for tests
global.fetch = vi.fn((input: string | URL | Request) => {
  const url =
    typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

  // Mock navigation endpoint
  if (url.includes('/navigation/main')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          id: 'main-nav',
          name: 'Main Navigation',
          items: [
            { type: 'link', label: 'Home', url: '/', children: [] },
            { type: 'link', label: 'About', url: '/about', children: [] },
          ],
        }),
    } as Response);
  }

  // Mock page endpoint
  if (url.includes('/pages/id/') || url.match(/\/pages\/[^/]+$/)) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          id: 'test-page-id',
          slug: 'test-page',
          title: 'Test Page',
          pageType: 'default',
          sections: [{ type: 'hero', data: { title: 'Test Hero' } }],
        }),
    } as Response);
  }

  // Mock PUT requests (save operations)
  if (url.includes('/navigation/id/') || url.includes('/pages/id/')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    } as Response);
  }

  // Default: return empty success response
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
  } as Response);
}) as typeof fetch;
