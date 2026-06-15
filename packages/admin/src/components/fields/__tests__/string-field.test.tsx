import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { StringField } from '../string-field';

describe('StringField', () => {
  it('renders with label', () => {
    render(<StringField label="Title" name="title" />);

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays placeholder text', () => {
    render(<StringField label="Title" name="title" placeholder="Enter title..." />);

    expect(screen.getByPlaceholderText('Enter title...')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<StringField label="Title" name="title" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show required indicator when not required', () => {
    render(<StringField label="Title" name="title" />);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('displays validation error below input', () => {
    render(<StringField label="Title" name="title" error="Title is required" />);

    expect(screen.getByText('Title is required')).toBeInTheDocument();
  });

  it('sets aria-invalid when error is present', () => {
    render(<StringField label="Title" name="title" error="Title is required" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when no error', () => {
    render(<StringField label="Title" name="title" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<StringField label="Title" name="title" />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello World');

    expect(input).toHaveValue('Hello World');
  });

  it('uses provided id for label association', () => {
    render(<StringField label="Title" id="custom-id" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'custom-id');
  });

  it('applies custom className', () => {
    const { container } = render(
      <StringField label="Title" name="title" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders description when no error is present', () => {
    render(<StringField label="Title" name="title" description="Help text" />);

    expect(screen.getByText('Help text')).toBeInTheDocument();
  });

  it('hides description when error is present', () => {
    render(<StringField label="Title" name="title" description="Help text" error="Required" />);

    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.queryByText('Help text')).not.toBeInTheDocument();
  });
});
