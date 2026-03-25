import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from '../card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with default variant', () => {
    render(<Card>Default</Card>);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('bg-[var(--admin-surface-card)]');
    expect(card).toHaveClass('p-6');
  });

  it('applies outlined variant', () => {
    render(<Card variant="outlined">Outlined</Card>);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('border');
    expect(card).not.toHaveClass('shadow-[var(--admin-shadow-xs)]');
    expect(card).not.toHaveClass('shadow-[var(--admin-shadow-md)]');
  });

  it('applies elevated variant', () => {
    render(<Card variant="elevated">Elevated</Card>);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('shadow-[var(--admin-shadow-md)]');
  });

  it('applies padding variants', () => {
    const { rerender } = render(<Card padding="none">None</Card>);
    expect(screen.getByTestId('card')).not.toHaveClass('p-4', 'p-6', 'p-8');

    rerender(<Card padding="sm">Small</Card>);
    expect(screen.getByTestId('card')).toHaveClass('p-4');

    rerender(<Card padding="lg">Large</Card>);
    expect(screen.getByTestId('card')).toHaveClass('p-8');
  });

  it('forwards className', () => {
    render(<Card className="my-custom-class">Custom</Card>);

    expect(screen.getByTestId('card')).toHaveClass('my-custom-class');
  });
});
