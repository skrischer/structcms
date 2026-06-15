import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from '../empty-state';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No items found" />);

    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('renders with description', () => {
    render(<EmptyState title="No items" description="Try adding some items to get started." />);

    expect(screen.getByText('Try adding some items to get started.')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(<EmptyState title="No items" icon={<span data-testid="test-icon">Icon</span>} />);

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders with action button', () => {
    render(<EmptyState title="No items" action={<button type="button">Add item</button>} />);

    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<EmptyState title="Empty" className="my-custom-class" />);

    expect(screen.getByTestId('empty-state')).toHaveClass('my-custom-class');
  });

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="Empty" />);

    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(1);
  });

  it('does not render icon wrapper when icon is not provided', () => {
    render(<EmptyState title="Empty" />);

    const emptyState = screen.getByTestId('empty-state');
    expect(emptyState.children).toHaveLength(1);
  });

  it('does not render action wrapper when action is not provided', () => {
    render(<EmptyState title="Empty" />);

    const emptyState = screen.getByTestId('empty-state');
    expect(emptyState.querySelector('.mt-4')).not.toBeInTheDocument();
  });

  it('defaults to inline variant', () => {
    render(<EmptyState title="Empty" />);

    const el = screen.getByTestId('empty-state');
    expect(el.className).toContain('py-12 px-6');
    expect(el.className).not.toContain('rounded-lg');
  });

  describe('variant="card"', () => {
    it('renders card container with border and shadow', () => {
      render(<EmptyState title="Empty" variant="card" />);

      const el = screen.getByTestId('empty-state');
      expect(el.className).toContain('rounded-lg');
      expect(el.className).toContain('border');
      expect(el.className).toContain('shadow-xs');
      expect(el.className).toContain('py-12 px-8');
    });

    it('renders icon in a circle when variant is card', () => {
      render(
        <EmptyState title="Empty" variant="card" icon={<span data-testid="test-icon">Icon</span>} />
      );

      const icon = screen.getByTestId('test-icon');
      const iconWrapper = icon.parentElement;
      expect(iconWrapper?.className).toContain('w-16');
      expect(iconWrapper?.className).toContain('h-16');
      expect(iconWrapper?.className).toContain('rounded-full');
    });

    it('renders title with semibold font in card mode', () => {
      render(<EmptyState title="Empty Title" variant="card" />);

      const title = screen.getByText('Empty Title');
      expect(title.className).toContain('font-semibold');
      expect(title.className).toContain('text-[var(--admin-gray-900)]');
    });

    it('renders title with medium font in inline mode', () => {
      render(<EmptyState title="Empty Title" />);

      const title = screen.getByText('Empty Title');
      expect(title.className).toContain('font-medium');
      expect(title.className).toContain('text-[var(--admin-gray-800)]');
    });

    it('renders description in card mode', () => {
      render(<EmptyState title="Empty" variant="card" description="Some description" />);

      expect(screen.getByText('Some description')).toBeInTheDocument();
    });

    it('renders action in card mode', () => {
      render(
        <EmptyState
          title="Empty"
          variant="card"
          action={<button type="button">Do something</button>}
        />
      );

      expect(screen.getByRole('button', { name: 'Do something' })).toBeInTheDocument();
    });
  });
});
