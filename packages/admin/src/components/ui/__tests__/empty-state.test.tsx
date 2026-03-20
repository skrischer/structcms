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
});
