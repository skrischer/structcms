import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { UrlField } from '../url-field';

describe('UrlField', () => {
  it('renders with label', () => {
    render(<UrlField label="Website" name="website" />);

    expect(screen.getByLabelText('Website')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<UrlField label="Website" name="website" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show required indicator when not required', () => {
    render(<UrlField label="Website" name="website" />);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('displays validation error', () => {
    render(<UrlField label="Website" name="website" error="Invalid URL" />);

    expect(screen.getByText('Invalid URL')).toBeInTheDocument();
  });

  it('has type="url"', () => {
    render(<UrlField label="Website" name="website" />);

    expect(screen.getByLabelText('Website')).toHaveAttribute('type', 'url');
  });

  it('has default placeholder "https://..."', () => {
    render(<UrlField label="Website" name="website" />);

    expect(screen.getByPlaceholderText('https://...')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <UrlField label="Website" name="website" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies error styling', () => {
    render(<UrlField label="Website" name="website" error="Invalid URL" />);

    const input = screen.getByLabelText('Website');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<UrlField label="Website" name="website" />);

    const input = screen.getByLabelText('Website');
    await user.type(input, 'https://example.com');

    expect(input).toHaveValue('https://example.com');
  });

  it('renders description when no error is present', () => {
    render(<UrlField label="Website" name="website" description="Help text" />);

    expect(screen.getByText('Help text')).toBeInTheDocument();
  });

  it('hides description when error is present', () => {
    render(<UrlField label="Website" name="website" description="Help text" error="Invalid URL" />);

    expect(screen.getByText('Invalid URL')).toBeInTheDocument();
    expect(screen.queryByText('Help text')).not.toBeInTheDocument();
  });
});
