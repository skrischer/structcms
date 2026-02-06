import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StringInput } from '../string-input';

describe('StringInput', () => {
  it('renders with label', () => {
    render(<StringInput label="Title" name="title" />);

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays placeholder text', () => {
    render(
      <StringInput label="Title" name="title" placeholder="Enter title..." />
    );

    expect(screen.getByPlaceholderText('Enter title...')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<StringInput label="Title" name="title" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show required indicator when not required', () => {
    render(<StringInput label="Title" name="title" />);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('displays validation error below input', () => {
    render(
      <StringInput label="Title" name="title" error="Title is required" />
    );

    expect(screen.getByText('Title is required')).toBeInTheDocument();
  });

  it('sets aria-invalid when error is present', () => {
    render(
      <StringInput label="Title" name="title" error="Title is required" />
    );

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when no error', () => {
    render(<StringInput label="Title" name="title" />);

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-invalid',
      'false'
    );
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<StringInput label="Title" name="title" />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello World');

    expect(input).toHaveValue('Hello World');
  });

  it('uses provided id for label association', () => {
    render(<StringInput label="Title" id="custom-id" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'custom-id');
  });

  it('applies custom className', () => {
    const { container } = render(
      <StringInput label="Title" name="title" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
