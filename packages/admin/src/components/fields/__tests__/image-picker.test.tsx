import { createRegistry } from '@structcms/core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminProvider } from '../../../context/admin-context';
import { ImagePicker } from '../image-picker';

describe('ImagePicker', () => {
  it('renders with label', () => {
    render(<ImagePicker label="Hero Image" name="hero" />);

    expect(screen.getByText('Hero Image')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<ImagePicker label="Hero Image" name="hero" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows "No image selected" when no value', () => {
    render(<ImagePicker label="Hero Image" name="hero" />);

    expect(screen.getByText('No image selected')).toBeInTheDocument();
  });

  it('shows Browse Media button when no value', () => {
    render(<ImagePicker label="Hero Image" name="hero" />);

    expect(screen.getByTestId('browse-button')).toBeInTheDocument();
    expect(screen.getByText('Browse Media')).toBeInTheDocument();
  });

  it('shows image preview when value is set', () => {
    render(<ImagePicker label="Hero Image" name="hero" value="https://example.com/image.jpg" />);

    const preview = screen.getByTestId('image-preview');
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('shows Change and Clear buttons when value is set', () => {
    render(<ImagePicker label="Hero Image" name="hero" value="https://example.com/image.jpg" />);

    expect(screen.getByText('Change')).toBeInTheDocument();
    expect(screen.getByTestId('clear-button')).toBeInTheDocument();
  });

  it('calls onBrowse when Browse Media button is clicked', async () => {
    const handleBrowse = vi.fn();
    const user = userEvent.setup();

    render(<ImagePicker label="Hero Image" name="hero" onBrowse={handleBrowse} />);

    await user.click(screen.getByTestId('browse-button'));

    expect(handleBrowse).toHaveBeenCalledTimes(1);
  });

  it('calls onBrowse when Change button is clicked', async () => {
    const handleBrowse = vi.fn();
    const user = userEvent.setup();

    render(
      <ImagePicker
        label="Hero Image"
        name="hero"
        value="https://example.com/image.jpg"
        onBrowse={handleBrowse}
      />
    );

    await user.click(screen.getByText('Change'));

    expect(handleBrowse).toHaveBeenCalledTimes(1);
  });

  it('calls onChange with empty string when Clear button is clicked', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <ImagePicker
        label="Hero Image"
        name="hero"
        value="https://example.com/image.jpg"
        onChange={handleChange}
      />
    );

    await user.click(screen.getByTestId('clear-button'));

    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('displays validation error below picker', () => {
    render(<ImagePicker label="Hero Image" name="hero" error="Image is required" />);

    expect(screen.getByText('Image is required')).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    render(<ImagePicker label="Hero Image" name="hero" error="Error message" />);

    const container = document.querySelector('.border-destructive');
    expect(container).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ImagePicker label="Hero Image" name="hero" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});

const registry = createRegistry({ sections: [] });

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <AdminProvider registry={registry} apiBaseUrl="/api/cms">
      {ui}
    </AdminProvider>
  );
}

function mockFetchSuccess(data: Array<{ id: string; url: string; filename: string }>) {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
    new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

describe('ImagePicker built-in MediaBrowser dialog', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('opens MediaBrowser dialog when Browse Media is clicked without onBrowse', async () => {
    mockFetchSuccess([]);
    const user = userEvent.setup();

    renderWithProvider(<ImagePicker label="Hero Image" name="hero" />);

    await user.click(screen.getByTestId('browse-button'));

    await waitFor(() => {
      expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument();
    });
    expect(screen.getByText('Select Media')).toBeInTheDocument();
    expect(screen.getByTestId('media-browser')).toBeInTheDocument();
  });

  it('closes dialog when close button is clicked', async () => {
    mockFetchSuccess([]);
    const user = userEvent.setup();

    renderWithProvider(<ImagePicker label="Hero Image" name="hero" />);

    await user.click(screen.getByTestId('browse-button'));

    await waitFor(() => {
      expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('dialog-close'));

    await waitFor(() => {
      expect(screen.queryByTestId('dialog-overlay')).not.toBeInTheDocument();
    });
  });

  it('selects media item and closes dialog', async () => {
    const mockMedia = [{ id: '1', url: 'https://example.com/img1.jpg', filename: 'img1.jpg' }];
    mockFetchSuccess(mockMedia);
    const handleChange = vi.fn();
    const user = userEvent.setup();

    renderWithProvider(<ImagePicker label="Hero Image" name="hero" onChange={handleChange} />);

    await user.click(screen.getByTestId('browse-button'));

    await waitFor(() => {
      expect(screen.getByTestId('media-select-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('media-select-1'));

    expect(handleChange).toHaveBeenCalledWith('https://example.com/img1.jpg');
    await waitFor(() => {
      expect(screen.queryByTestId('dialog-overlay')).not.toBeInTheDocument();
    });
  });

  it('does not render dialog when onBrowse is provided', () => {
    const handleBrowse = vi.fn();

    render(<ImagePicker label="Hero Image" name="hero" onBrowse={handleBrowse} />);

    expect(screen.queryByTestId('dialog-overlay')).not.toBeInTheDocument();
  });
});
