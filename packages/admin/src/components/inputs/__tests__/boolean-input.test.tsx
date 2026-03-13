import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { BooleanInput } from '../boolean-input';

describe('BooleanInput', () => {
  it('renders with label', () => {
    render(<BooleanInput label="Active" name="active" />);

    expect(screen.getByLabelText('Active')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<BooleanInput label="Active" name="active" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show required indicator when not required', () => {
    render(<BooleanInput label="Active" name="active" />);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('displays validation error below input', () => {
    render(<BooleanInput label="Active" name="active" error="Field is required" />);

    expect(screen.getByText('Field is required')).toBeInTheDocument();
  });

  it('sets aria-invalid when error is present', () => {
    render(<BooleanInput label="Active" name="active" error="Field is required" />);

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when no error', () => {
    render(<BooleanInput label="Active" name="active" />);

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'false');
  });

  it('toggles checked state on click', async () => {
    const user = userEvent.setup();
    render(<BooleanInput label="Active" name="active" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('applies custom className', () => {
    const { container } = render(
      <BooleanInput label="Active" name="active" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders as unchecked by default', () => {
    render(<BooleanInput label="Active" name="active" />);

    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
});
