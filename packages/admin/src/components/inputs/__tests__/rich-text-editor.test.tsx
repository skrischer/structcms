import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RichTextEditor } from '../rich-text-editor';

describe('RichTextEditor', () => {
  it('renders with label', () => {
    render(<RichTextEditor label="Content" name="content" />);

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<RichTextEditor label="Content" name="content" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show required indicator when not required', () => {
    render(<RichTextEditor label="Content" name="content" />);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('displays validation error below editor', () => {
    render(
      <RichTextEditor
        label="Content"
        name="content"
        error="Content is required"
      />
    );

    expect(screen.getByText('Content is required')).toBeInTheDocument();
  });

  it('renders toolbar with formatting buttons', () => {
    render(<RichTextEditor label="Content" name="content" />);

    expect(screen.getByTitle('Bold')).toBeInTheDocument();
    expect(screen.getByTitle('Italic')).toBeInTheDocument();
    expect(screen.getByTitle('Link')).toBeInTheDocument();
    expect(screen.getByTitle('Heading 1')).toBeInTheDocument();
    expect(screen.getByTitle('Heading 2')).toBeInTheDocument();
    expect(screen.getByTitle('Heading 3')).toBeInTheDocument();
    expect(screen.getByTitle('Bullet List')).toBeInTheDocument();
    expect(screen.getByTitle('Ordered List')).toBeInTheDocument();
  });

  it('renders editor content area', () => {
    render(<RichTextEditor label="Content" name="content" />);

    expect(document.querySelector('.ProseMirror')).toBeInTheDocument();
  });

  it('initializes with provided value', () => {
    render(
      <RichTextEditor
        label="Content"
        name="content"
        value="<p>Hello World</p>"
      />
    );

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('calls onChange when content changes', async () => {
    const handleChange = vi.fn();
    render(
      <RichTextEditor
        label="Content"
        name="content"
        onChange={handleChange}
      />
    );

    const editor = document.querySelector('.ProseMirror');
    expect(editor).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RichTextEditor label="Content" name="content" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies error styling when error is present', () => {
    render(
      <RichTextEditor label="Content" name="content" error="Error message" />
    );

    const editorContainer = document.querySelector('.border-destructive');
    expect(editorContainer).toBeInTheDocument();
  });
});
