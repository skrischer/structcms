import { createRegistry } from '@structcms/core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminProvider } from '../../../context/admin-context';
import { FilePicker } from '../file-picker';

describe('FilePicker', () => {
  it('renders with label', () => {
    render(<FilePicker label="Download File" name="file" />);

    expect(screen.getByText('Download File')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<FilePicker label="Download File" name="file" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows "No file selected" when no value', () => {
    render(<FilePicker label="Download File" name="file" />);

    expect(screen.getByText('No file selected')).toBeInTheDocument();
  });

  it('shows Browse Files button when no value', () => {
    render(<FilePicker label="Download File" name="file" />);

    expect(screen.getByTestId('browse-button')).toBeInTheDocument();
    expect(screen.getByText('Browse Files')).toBeInTheDocument();
  });

  it('shows filename when value is set', () => {
    render(<FilePicker label="Download File" name="file" value="https://example.com/docs/report.pdf" />);

    expect(screen.getByTestId('file-name')).toBeInTheDocument();
    expect(screen.getByText('report.pdf')).toBeInTheDocument();
  });

  it('shows Change and Clear buttons when value is set', () => {
    render(<FilePicker label="Download File" name="file" value="https://example.com/report.pdf" />);

    expect(screen.getByText('Change')).toBeInTheDocument();
    expect(screen.getByTestId('clear-button')).toBeInTheDocument();
  });

  it('calls onChange with empty string when Clear button is clicked', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <FilePicker
        label="Download File"
        name="file"
        value="https://example.com/report.pdf"
        onChange={handleChange}
      />
    );

    await user.click(screen.getByTestId('clear-button'));

    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('displays validation error below picker', () => {
    render(<FilePicker label="Download File" name="file" error="File is required" />);

    expect(screen.getByText('File is required')).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    render(<FilePicker label="Download File" name="file" error="Error message" />);

    const container = document.querySelector('.border-destructive');
    expect(container).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <FilePicker label="Download File" name="file" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('calls onBrowse when Browse Files button is clicked', async () => {
    const handleBrowse = vi.fn();
    const user = userEvent.setup();

    render(<FilePicker label="Download File" name="file" onBrowse={handleBrowse} />);

    await user.click(screen.getByTestId('browse-button'));

    expect(handleBrowse).toHaveBeenCalledTimes(1);
  });

  it('does not render dialog when onBrowse is provided', () => {
    const handleBrowse = vi.fn();

    render(<FilePicker label="Download File" name="file" onBrowse={handleBrowse} />);

    expect(screen.queryByTestId('dialog-overlay')).not.toBeInTheDocument();
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

describe('FilePicker built-in MediaBrowser dialog', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('opens MediaBrowser dialog when Browse Files is clicked without onBrowse', async () => {
    mockFetchSuccess([]);
    const user = userEvent.setup();

    renderWithProvider(<FilePicker label="Download File" name="file" />);

    await user.click(screen.getByTestId('browse-button'));

    await waitFor(() => {
      expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument();
    });
    expect(screen.getByText('Select File')).toBeInTheDocument();
    expect(screen.getByTestId('media-browser')).toBeInTheDocument();
  });

  it('closes dialog when close button is clicked', async () => {
    mockFetchSuccess([]);
    const user = userEvent.setup();

    renderWithProvider(<FilePicker label="Download File" name="file" />);

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
    const mockMedia = [{ id: '1', url: 'https://example.com/report.pdf', filename: 'report.pdf' }];
    mockFetchSuccess(mockMedia);
    const handleChange = vi.fn();
    const user = userEvent.setup();

    renderWithProvider(<FilePicker label="Download File" name="file" onChange={handleChange} />);

    await user.click(screen.getByTestId('browse-button'));

    await waitFor(() => {
      expect(screen.getByTestId('media-select-1')).toBeInTheDocument();
    });

    await user.click(screen.getByTestId('media-select-1'));

    expect(handleChange).toHaveBeenCalledWith('https://example.com/report.pdf');
    await waitFor(() => {
      expect(screen.queryByTestId('dialog-overlay')).not.toBeInTheDocument();
    });
  });
});
