import { createRegistry, defineSection } from '@structcms/core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { AdminProvider } from '../../../context/admin-context';
import { KpiCards } from '../kpi-cards';

const heroSection = defineSection({
  name: 'hero',
  fields: { title: z.string() },
});

const contentSection = defineSection({
  name: 'content',
  fields: { body: z.string() },
});

const registry = createRegistry({
  sections: [heroSection, contentSection],
  pageTypes: [],
});

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <AdminProvider registry={registry} apiBaseUrl="/api/cms">
      {ui}
    </AdminProvider>
  );
}

function mockFetchResponses(
  responses: Array<{ data: unknown[]; status?: number } | { error: string; status: number }>
) {
  const fetchMock = vi.spyOn(globalThis, 'fetch');
  for (const resp of responses) {
    if ('error' in resp) {
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { message: resp.error } }), {
          status: resp.status,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    } else {
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify(resp.data), {
          status: resp.status ?? 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }
  }
  return fetchMock;
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('KpiCards', () => {
  it('renders the kpi-cards container', () => {
    mockFetchResponses([{ data: [] }, { data: [] }, { data: [] }]);

    renderWithProvider(<KpiCards />);
    expect(screen.getByTestId('kpi-cards')).toBeInTheDocument();
  });

  it('shows skeleton loaders during data fetching', () => {
    // Never resolving fetch to keep loading state
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));

    renderWithProvider(<KpiCards />);

    expect(screen.getByTestId('kpi-pages-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('kpi-media-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('kpi-navigation-skeleton')).toBeInTheDocument();
    // Sections is from registry, never loading
    expect(screen.queryByTestId('kpi-sections-skeleton')).not.toBeInTheDocument();
  });

  it('displays counts after successful fetch', async () => {
    mockFetchResponses([
      { data: [{ id: '1' }, { id: '2' }, { id: '3' }] }, // pages
      { data: [{ id: '1' }, { id: '2' }] }, // media
      { data: [{ id: '1' }] }, // navigation
    ]);

    renderWithProvider(<KpiCards />);

    await waitFor(() => {
      expect(screen.getByTestId('kpi-pages-value')).toHaveTextContent('3');
    });

    expect(screen.getByTestId('kpi-media-value')).toHaveTextContent('2');
    expect(screen.getByTestId('kpi-navigation-value')).toHaveTextContent('1');
  });

  it('shows sections count from registry', () => {
    mockFetchResponses([{ data: [] }, { data: [] }, { data: [] }]);

    renderWithProvider(<KpiCards />);

    // Registry has 2 sections (hero, content)
    expect(screen.getByTestId('kpi-sections-value')).toHaveTextContent('2');
  });

  it('shows error state when API call fails', async () => {
    mockFetchResponses([
      { error: 'Server error', status: 500 }, // pages fails
      { data: [{ id: '1' }] }, // media ok
      { data: [] }, // navigation ok
    ]);

    renderWithProvider(<KpiCards />);

    await waitFor(() => {
      expect(screen.getByTestId('kpi-pages-error')).toBeInTheDocument();
    });

    expect(screen.getByTestId('kpi-pages-retry')).toBeInTheDocument();
    expect(screen.getByTestId('kpi-media-value')).toHaveTextContent('1');
    expect(screen.getByTestId('kpi-navigation-value')).toHaveTextContent('0');
  });

  it('handles multiple API failures independently', async () => {
    mockFetchResponses([
      { error: 'Pages error', status: 500 },
      { error: 'Media error', status: 500 },
      { data: [{ id: '1' }, { id: '2' }] }, // navigation ok
    ]);

    renderWithProvider(<KpiCards />);

    await waitFor(() => {
      expect(screen.getByTestId('kpi-pages-error')).toBeInTheDocument();
    });

    expect(screen.getByTestId('kpi-media-error')).toBeInTheDocument();
    expect(screen.getByTestId('kpi-navigation-value')).toHaveTextContent('2');
  });

  it('retries failed fetch when retry button is clicked', async () => {
    const user = userEvent.setup();

    // First: pages fails, media/nav ok
    const fetchMock = mockFetchResponses([
      { error: 'Server error', status: 500 },
      { data: [] },
      { data: [] },
    ]);

    renderWithProvider(<KpiCards />);

    await waitFor(() => {
      expect(screen.getByTestId('kpi-pages-error')).toBeInTheDocument();
    });

    // Mock retry response
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify([{ id: '1' }, { id: '2' }]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await user.click(screen.getByTestId('kpi-pages-retry'));

    await waitFor(() => {
      expect(screen.getByTestId('kpi-pages-value')).toHaveTextContent('2');
    });
  });

  it('uses parallel fetching with Promise.allSettled', () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));

    renderWithProvider(<KpiCards />);

    // All 3 fetch calls should be made immediately (in parallel)
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/cms/pages',
      expect.objectContaining({ method: 'GET' })
    );
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/cms/media',
      expect.objectContaining({ method: 'GET' })
    );
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/cms/navigation',
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('renders all four KPI cards', () => {
    mockFetchResponses([{ data: [] }, { data: [] }, { data: [] }]);

    renderWithProvider(<KpiCards />);

    expect(screen.getByTestId('kpi-pages')).toBeInTheDocument();
    expect(screen.getByTestId('kpi-media')).toBeInTheDocument();
    expect(screen.getByTestId('kpi-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('kpi-sections')).toBeInTheDocument();
  });

  it('displays correct labels', () => {
    mockFetchResponses([{ data: [] }, { data: [] }, { data: [] }]);

    renderWithProvider(<KpiCards />);

    expect(screen.getByText('Pages')).toBeInTheDocument();
    expect(screen.getByText('Media Files')).toBeInTheDocument();
    expect(screen.getByText('Navigation Sets')).toBeInTheDocument();
    expect(screen.getByText('Sections')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    mockFetchResponses([{ data: [] }, { data: [] }, { data: [] }]);

    renderWithProvider(<KpiCards className="my-custom-class" />);
    expect(screen.getByTestId('kpi-cards')).toHaveClass('my-custom-class');
  });
});
