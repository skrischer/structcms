import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { UrlInput } from '../url-input';

describe('UrlInput', () => {
  it('renders with label', () => {
    render(<UrlInput label="Website" name="website" />);

    expect(screen.getByLabelText('Website')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<UrlInput label="Website" name="website" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show required indicator when not required', () => {
    render(<UrlInput label="Website" name="website" />);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('displays validation error', () => {
    render(<UrlInput label="Website" name="website" error="Invalid URL" />);

    expect(screen.getByText('Invalid URL')).toBeInTheDocument();
  });

  it('has type="url"', () => {
    render(<UrlInput label="Website" name="website" />);

    expect(screen.getByLabelText('Website')).toHaveAttribute('type', 'url');
  });

  it('has default placeholder "https://..."', () => {
    render(<UrlInput label="Website" name="website" />);

    expect(screen.getByPlaceholderText('https://...')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <UrlInput label="Website" name="website" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies error styling', () => {
    render(<UrlInput label="Website" name="website" error="Invalid URL" />);

    const input = screen.getByLabelText('Website');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<UrlInput label="Website" name="website" />);

    const input = screen.getByLabelText('Website');
    await user.type(input, 'https://example.com');

    expect(input).toHaveValue('https://example.com');
  });
});
