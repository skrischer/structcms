import { createRegistry, definePageType } from '@structcms/core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminProvider } from '../../../context/admin-context';
import { PageList, type PageSummary } from '../page-list';

const blogPageType = definePageType({
  name: 'blog',
  allowedSections: ['hero', 'content'],
});

const landingPageType = definePageType({
  name: 'landing',
  allowedSections: ['hero'],
});

const registry = createRegistry({
  sections: [],
  pageTypes: [blogPageType, landingPageType],
});

const mockPages: PageSummary[] = [
  { id: '1', title: 'Home Page', slug: 'home', pageType: 'landing' },
  { id: '2', title: 'About Us', slug: 'about', pageType: 'landing' },
  { id: '3', title: 'Blog Post', slug: 'blog-post', pageType: 'blog' },
];

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

function mockFetchError(message: string) {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
    new Response(JSON.stringify({ error: { message } }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('PageList', () => {
  it('renders page list container', async () => {
    mockFetchSuccess([]);

    renderWithProvider(<PageList onSelectPage={() => {}} onCreatePage={() => {}} />);

    expect(screen.getByTestId('page-list')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    mockFetchSuccess([]);

    renderWithProvider(<PageList onSelectPage={() => {}} onCreatePage={() => {}} />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders pages after loading', async () => {
    mockFetchSuccess(mockPages);

    renderWithProvider(<PageList onSelectPage={() => {}} onCreatePage={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId('page-table')).toBeInTheDocument();
    });

    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Blog Post')).toBeInTheDocument();
  });

  it('shows empty state when no pages', async () => {
    mockFetchSuccess([]);

    renderWithProvider(<PageList onSelectPage={() => {}} onCreatePage={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    expect(screen.getByText(/No pages yet/)).toBeInTheDocument();
  });

  it('shows error state on API failure', async () => {
    mockFetchError('Server error');

    renderWithProvider(<PageList onSelectPage={() => {}} onCreatePage={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    expect(screen.getByText('Server error')).toBeInTheDocument();
  });

  it('renders Create New Page button', async () => {
    mockFetchSuccess([]);

    renderWithProvider(<PageList onSelectPage={() => {}} onCreatePage={() => {}} />);

    expect(screen.getByTestId('create-page')).toBeInTheDocument();
    expect(screen.getByText('Create New Page')).toBeInTheDocument();
  });

  it('calls onCreatePage when Create New Page is clicked', async () => {
    mockFetchSuccess([]);
    const handleCreate = vi.fn();
    const user = userEvent.setup();

    renderWithProvider(<PageList onSelectPage={() => {}} onCreatePage={handleCreate} />);

    await user.click(screen.getByTestId('create-page'));

    expect(handleCreate).toHaveBeenCalledTimes(1);
  });

  it('calls onSelectPage when a row is clicked', async () => {
    mockFetchSuccess(mockPages);
    const handleSelect = vi.fn();
    const user = userEvent.setup();

    renderWithProvider(<PageList onSelectPage={handleSelect} onCreatePage={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId('page-row-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('page-row-1'));

    expect(handleSelect).toHaveBeenCalledWith(mockPages[0]);
  });

  it('filters pages by search input', async () => {
    mockFetchSuccess(mockPages);
    const user = userEvent.setup();

    renderWithProvider(<PageList onSelectPage={() => {}} onCreatePage={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId('page-table')).toBeInTheDocument();
    });

    await user.type(screen.getByTestId('search-input'), 'blog');

    expect(screen.getByText('Blog Post')).toBeInTheDocument();
    expect(screen.queryByText('Home Page')).not.toBeInTheDocument();
    expect(screen.queryByText('About Us')).not.toBeInTheDocument();
  });

  it('filters pages by page type', async () => {
    mockFetchSuccess(mockPages);
    const user = userEvent.setup();

    renderWithProvider(<PageList onSelectPage={() => {}} onCreatePage={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId('page-table')).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByTestId('page-type-filter'), 'blog');

    expect(screen.getByText('Blog Post')).toBeInTheDocument();
    expect(screen.queryByText('Home Page')).not.toBeInTheDocument();
  });

  it('renders search input', async () => {
    mockFetchSuccess([]);

    renderWithProvider(<PageList onSelectPage={() => {}} onCreatePage={() => {}} />);

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('renders page type filter', async () => {
    mockFetchSuccess([]);

    renderWithProvider(<PageList onSelectPage={() => {}} onCreatePage={() => {}} />);

    expect(screen.getByTestId('page-type-filter')).toBeInTheDocument();
  });

  it('applies custom className', async () => {
    mockFetchSuccess([]);

    renderWithProvider(
      <PageList onSelectPage={() => {}} onCreatePage={() => {}} className="custom-class" />
    );

    expect(screen.getByTestId('page-list')).toHaveClass('custom-class');
  });
});
