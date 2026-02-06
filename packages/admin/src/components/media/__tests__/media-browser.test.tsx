import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRegistry } from '@structcms/core';
import { AdminProvider } from '../../../context/admin-context';
import { MediaBrowser, type MediaItem } from '../media-browser';

const registry = createRegistry({ sections: [] });

const mockMedia: MediaItem[] = [
  { id: '1', url: 'https://example.com/img1.jpg', filename: 'img1.jpg' },
  { id: '2', url: 'https://example.com/img2.jpg', filename: 'img2.jpg' },
  { id: '3', url: 'https://example.com/img3.jpg', filename: 'img3.jpg' },
];

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <AdminProvider registry={registry} apiBaseUrl="/api/cms">
      {ui}
    </AdminProvider>
  );
}

function mockFetchSuccess(data: MediaItem[]) {
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

describe('MediaBrowser', () => {
  it('renders media browser', async () => {
    mockFetchSuccess([]);

    renderWithProvider(<MediaBrowser />);

    expect(screen.getByTestId('media-browser')).toBeInTheDocument();
    expect(screen.getByText('Media')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    mockFetchSuccess([]);

    renderWithProvider(<MediaBrowser />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders media grid after loading', async () => {
    mockFetchSuccess(mockMedia);

    renderWithProvider(<MediaBrowser />);

    await waitFor(() => {
      expect(screen.getByTestId('media-grid')).toBeInTheDocument();
    });

    expect(screen.getByTestId('media-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('media-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('media-item-3')).toBeInTheDocument();
  });

  it('shows empty state when no media', async () => {
    mockFetchSuccess([]);

    renderWithProvider(<MediaBrowser />);

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    expect(screen.getByText(/No media files yet/)).toBeInTheDocument();
  });

  it('shows error state on API failure', async () => {
    mockFetchError('Server error');

    renderWithProvider(<MediaBrowser />);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    expect(screen.getByText('Server error')).toBeInTheDocument();
  });

  it('renders Upload button', async () => {
    mockFetchSuccess([]);

    renderWithProvider(<MediaBrowser />);

    expect(screen.getByTestId('upload-button')).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  it('renders hidden file input', async () => {
    mockFetchSuccess([]);

    renderWithProvider(<MediaBrowser />);

    const fileInput = screen.getByTestId('file-input');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('type', 'file');
  });

  it('calls onSelect when a media item is clicked', async () => {
    mockFetchSuccess(mockMedia);
    const handleSelect = vi.fn();
    const user = userEvent.setup();

    renderWithProvider(<MediaBrowser onSelect={handleSelect} />);

    await waitFor(() => {
      expect(screen.getByTestId('media-select-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('media-select-1'));

    expect(handleSelect).toHaveBeenCalledWith(mockMedia[0]);
  });

  it('renders delete button for each media item', async () => {
    mockFetchSuccess(mockMedia);

    renderWithProvider(<MediaBrowser />);

    await waitFor(() => {
      expect(screen.getByTestId('media-grid')).toBeInTheDocument();
    });

    expect(screen.getByTestId('media-delete-1')).toBeInTheDocument();
    expect(screen.getByTestId('media-delete-2')).toBeInTheDocument();
    expect(screen.getByTestId('media-delete-3')).toBeInTheDocument();
  });

  it('removes item from grid when delete is clicked', async () => {
    mockFetchSuccess(mockMedia);
    const user = userEvent.setup();

    renderWithProvider(<MediaBrowser />);

    await waitFor(() => {
      expect(screen.getByTestId('media-grid')).toBeInTheDocument();
    });

    // Mock delete API call
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(null), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await user.click(screen.getByTestId('media-delete-1'));

    await waitFor(() => {
      expect(screen.queryByTestId('media-item-1')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('media-item-2')).toBeInTheDocument();
  });

  it('shows Load More button when there are more items', async () => {
    // Return exactly pageSize items to indicate more available
    const fullPage = Array.from({ length: 12 }, (_, i) => ({
      id: String(i + 1),
      url: `https://example.com/img${i + 1}.jpg`,
      filename: `img${i + 1}.jpg`,
    }));
    mockFetchSuccess(fullPage);

    renderWithProvider(<MediaBrowser pageSize={12} />);

    await waitFor(() => {
      expect(screen.getByTestId('load-more')).toBeInTheDocument();
    });
  });

  it('does not show Load More when fewer items than pageSize', async () => {
    mockFetchSuccess(mockMedia); // 3 items, default pageSize=12

    renderWithProvider(<MediaBrowser />);

    await waitFor(() => {
      expect(screen.getByTestId('media-grid')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('load-more')).not.toBeInTheDocument();
  });

  it('displays filenames for each media item', async () => {
    mockFetchSuccess(mockMedia);

    renderWithProvider(<MediaBrowser />);

    await waitFor(() => {
      expect(screen.getByTestId('media-grid')).toBeInTheDocument();
    });

    expect(screen.getByText('img1.jpg')).toBeInTheDocument();
    expect(screen.getByText('img2.jpg')).toBeInTheDocument();
  });

  it('applies custom className', async () => {
    mockFetchSuccess([]);

    renderWithProvider(<MediaBrowser className="custom-class" />);

    expect(screen.getByTestId('media-browser')).toHaveClass('custom-class');
  });
});
