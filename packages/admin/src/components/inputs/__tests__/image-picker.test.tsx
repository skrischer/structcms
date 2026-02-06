import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    render(
      <ImagePicker
        label="Hero Image"
        name="hero"
        value="https://example.com/image.jpg"
      />
    );

    const preview = screen.getByTestId('image-preview');
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('shows Change and Clear buttons when value is set', () => {
    render(
      <ImagePicker
        label="Hero Image"
        name="hero"
        value="https://example.com/image.jpg"
      />
    );

    expect(screen.getByText('Change')).toBeInTheDocument();
    expect(screen.getByTestId('clear-button')).toBeInTheDocument();
  });

  it('calls onBrowse when Browse Media button is clicked', async () => {
    const handleBrowse = vi.fn();
    const user = userEvent.setup();

    render(
      <ImagePicker label="Hero Image" name="hero" onBrowse={handleBrowse} />
    );

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
    render(
      <ImagePicker
        label="Hero Image"
        name="hero"
        error="Image is required"
      />
    );

    expect(screen.getByText('Image is required')).toBeInTheDocument();
  });

  it('applies error styling when error is present', () => {
    render(
      <ImagePicker label="Hero Image" name="hero" error="Error message" />
    );

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
