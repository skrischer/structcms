import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from '../skeleton';

describe('Skeleton', () => {
  it('renders skeleton element', () => {
    render(<Skeleton />);

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('has pulse animation class', () => {
    render(<Skeleton />);

    expect(screen.getByTestId('skeleton')).toHaveClass('animate-pulse');
  });

  it('applies width and height via style', () => {
    render(<Skeleton width={200} height={20} />);

    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ width: '200px', height: '20px' });
  });

  it('applies custom className', () => {
    render(<Skeleton className="h-4 w-48" />);

    expect(screen.getByTestId('skeleton')).toHaveClass('h-4', 'w-48');
  });

  it('renders with string dimensions', () => {
    render(<Skeleton width="100%" height="2rem" />);

    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ width: '100%', height: '2rem' });
  });
});
