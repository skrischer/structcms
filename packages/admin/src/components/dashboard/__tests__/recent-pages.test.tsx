import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRegistry } from '@structcms/core';
import { AdminProvider } from '../../../context/admin-context';
import { RecentPages } from '../recent-pages';
import type { PageSummary } from '../../content/page-list';

const registry = createRegistry({
  sections: [],
  pageTypes: [],
});

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <AdminProvider registry={registry} apiBaseUrl="/api/cms">
      {ui}
    </AdminProvider>
  );
}

function mockFetchSuccess(data: PageSummary[]) {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
    new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

function mockFetchError() {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
    new Response(JSON.stringify({ error: { message: 'Server error' } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

const mockPages: PageSummary[] = [
  { id: '1', title: 'Old Page', slug: 'old', pageType: 'blog', updatedAt: '2026-01-01T00:00:00Z' },
  { id: '2', title: 'Newest Page', slug: 'newest', pageType: 'landing', updatedAt: '2026-02-09T12:00:00Z' },
  { id: '3', title: 'Middle Page', slug: 'middle', pageType: 'blog', updatedAt: '2026-01-15T00:00:00Z' },
];

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('RecentPages', () => {
  it('renders the recent-pages container', () => {
    mockFetchSuccess([]);
    renderWithProvider(<RecentPages onSelectPage={() => {}} />);
    expect(screen.getByTestId('recent-pages')).toBeInTheDocument();
  });

  it('renders heading', () => {
    mockFetchSuccess([]);
    renderWithProvider(<RecentPages onSelectPage={() => {}} />);
    expect(screen.getByText('Recent Pages')).toBeInTheDocument();
  });

  it('shows skeleton loading state', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      () => new Promise(() => {})
    );
    renderWithProvider(<RecentPages onSelectPage={() => {}} />);
    expect(screen.getByTestId('recent-pages-loading')).toBeInTheDocument();
  });

  it('displays pages sorted by updatedAt DESC', async () => {
    mockFetchSuccess(mockPages);
    renderWithProvider(<RecentPages onSelectPage={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId('recent-pages-list')).toBeInTheDocument();
    });

    const items = screen.getByTestId('recent-pages-list').children;
    // Newest first, then Middle, then Old
    expect(items[0]).toHaveTextContent('Newest Page');
    expect(items[1]).toHaveTextContent('Middle Page');
    expect(items[2]).toHaveTextContent('Old Page');
  });

  it('limits to 10 pages', async () => {
    const manyPages: PageSummary[] = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      title: `Page ${i + 1}`,
      slug: `page-${i + 1}`,
      pageType: 'blog',
      updatedAt: `2026-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`,
    }));

    mockFetchSuccess(manyPages);
    renderWithProvider(<RecentPages onSelectPage={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId('recent-pages-list')).toBeInTheDocument();
    });

    expect(screen.getByTestId('recent-pages-list').children).toHaveLength(10);
  });

  it('shows page title, slug, and timestamp', async () => {
    mockFetchSuccess(mockPages);
    renderWithProvider(<RecentPages onSelectPage={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId('recent-pages-list')).toBeInTheDocument();
    });

    expect(screen.getByText('Newest Page')).toBeInTheDocument();
    expect(screen.getByText('newest')).toBeInTheDocument();
    // Timestamp should be formatted
    const row = screen.getByTestId('recent-page-2');
    expect(row).toHaveTextContent(/Feb/);
  });

  it('calls onSelectPage when a row is clicked', async () => {
    const onSelectPage = vi.fn();
    mockFetchSuccess(mockPages);
    renderWithProvider(<RecentPages onSelectPage={onSelectPage} />);

    await waitFor(() => {
      expect(screen.getByTestId('recent-page-2')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('recent-page-2'));
    expect(onSelectPage).toHaveBeenCalledWith(mockPages[1]);
  });

  it('shows error state with specific message', async () => {
    mockFetchError();
    renderWithProvider(<RecentPages onSelectPage={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId('recent-pages-error')).toBeInTheDocument();
    });

    expect(screen.getByText('Unable to load recent pages')).toBeInTheDocument();
  });

  it('shows retry button on error', async () => {
    mockFetchError();
    renderWithProvider(<RecentPages onSelectPage={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId('recent-pages-retry')).toBeInTheDocument();
    });
  });

  it('retries fetch when retry button is clicked', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(globalThis, 'fetch');

    // First call fails
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: { message: 'Server error' } }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    renderWithProvider(<RecentPages onSelectPage={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId('recent-pages-retry')).toBeInTheDocument();
    });

    // Retry succeeds
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(mockPages), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await user.click(screen.getByTestId('recent-pages-retry'));

    await waitFor(() => {
      expect(screen.getByTestId('recent-pages-list')).toBeInTheDocument();
    });

    expect(screen.getByText('Newest Page')).toBeInTheDocument();
  });

  it('shows empty state when no pages exist', async () => {
    mockFetchSuccess([]);
    renderWithProvider(<RecentPages onSelectPage={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId('recent-pages-empty')).toBeInTheDocument();
    });

    expect(screen.getByText('No pages yet.')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    mockFetchSuccess([]);
    renderWithProvider(<RecentPages onSelectPage={() => {}} className="my-class" />);
    expect(screen.getByTestId('recent-pages')).toHaveClass('my-class');
  });

  it('handles pages without updatedAt field', async () => {
    const pagesWithoutDate: PageSummary[] = [
      { id: '1', title: 'No Date Page', slug: 'no-date', pageType: 'blog' },
      { id: '2', title: 'Has Date', slug: 'has-date', pageType: 'blog', updatedAt: '2026-02-01T00:00:00Z' },
    ];

    mockFetchSuccess(pagesWithoutDate);
    renderWithProvider(<RecentPages onSelectPage={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId('recent-pages-list')).toBeInTheDocument();
    });

    const items = screen.getByTestId('recent-pages-list').children;
    // Page with date should be first, page without date last
    expect(items[0]).toHaveTextContent('Has Date');
    expect(items[1]).toHaveTextContent('No Date Page');
  });
});
