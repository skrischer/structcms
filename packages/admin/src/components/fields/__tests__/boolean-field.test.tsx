import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BooleanField } from '../boolean-field';

describe('BooleanField', () => {
  it('renders with label', () => {
    render(<BooleanField label="Active" name="active" />);

    expect(screen.getByLabelText('Active')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<BooleanField label="Active" name="active" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show required indicator when not required', () => {
    render(<BooleanField label="Active" name="active" />);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('displays validation error below input', () => {
    render(<BooleanField label="Active" name="active" error="Field is required" />);

    expect(screen.getByText('Field is required')).toBeInTheDocument();
  });

  it('renders error via FieldMessage with alert role', () => {
    render(<BooleanField label="Active" name="active" error="Field is required" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Field is required');
  });

  it('calls onCheckedChange when clicked', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<BooleanField label="Active" name="active" onCheckedChange={handleChange} />);

    await user.click(screen.getByRole('switch'));

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('applies custom className', () => {
    const { container } = render(
      <BooleanField label="Active" name="active" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders as unchecked by default', () => {
    render(<BooleanField label="Active" name="active" />);

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('renders as checked when checked prop is true', () => {
    render(<BooleanField label="Active" name="active" checked />);

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
});
