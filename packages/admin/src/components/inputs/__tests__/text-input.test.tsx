import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput } from '../text-input';

describe('TextInput', () => {
  it('renders with label', () => {
    render(<TextInput label="Description" name="description" />);

    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays placeholder text', () => {
    render(
      <TextInput
        label="Description"
        name="description"
        placeholder="Enter description..."
      />
    );

    expect(
      screen.getByPlaceholderText('Enter description...')
    ).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<TextInput label="Description" name="description" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show required indicator when not required', () => {
    render(<TextInput label="Description" name="description" />);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('displays validation error below textarea', () => {
    render(
      <TextInput
        label="Description"
        name="description"
        error="Description is required"
      />
    );

    expect(screen.getByText('Description is required')).toBeInTheDocument();
  });

  it('sets aria-invalid when error is present', () => {
    render(
      <TextInput
        label="Description"
        name="description"
        error="Description is required"
      />
    );

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('uses default rows of 3', () => {
    render(<TextInput label="Description" name="description" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '3');
  });

  it('supports configurable rows', () => {
    render(<TextInput label="Description" name="description" rows={5} />);

    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<TextInput label="Description" name="description" />);

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Hello World');

    expect(textarea).toHaveValue('Hello World');
  });

  it('applies custom className', () => {
    const { container } = render(
      <TextInput
        label="Description"
        name="description"
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
