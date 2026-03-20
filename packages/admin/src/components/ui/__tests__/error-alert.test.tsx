import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ErrorAlert } from '../error-alert';

describe('ErrorAlert', () => {
  it('renders error message', () => {
    render(<ErrorAlert>Something went wrong</ErrorAlert>);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('has role="alert"', () => {
    render(<ErrorAlert>Error</ErrorAlert>);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders as <p> without onRetry', () => {
    render(<ErrorAlert data-testid="my-error">Error</ErrorAlert>);

    const el = screen.getByTestId('my-error');
    expect(el.tagName).toBe('P');
  });

  it('renders as <div> with onRetry', () => {
    render(
      <ErrorAlert data-testid="my-error" onRetry={() => {}}>
        Error
      </ErrorAlert>
    );

    const el = screen.getByTestId('my-error');
    expect(el.tagName).toBe('DIV');
  });

  it('renders Retry button when onRetry is provided', () => {
    render(
      <ErrorAlert data-testid="my-error" onRetry={() => {}}>
        Error
      </ErrorAlert>
    );

    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('does not render Retry button without onRetry', () => {
    render(<ErrorAlert>Error</ErrorAlert>);

    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });

  it('calls onRetry when Retry button is clicked', async () => {
    const handleRetry = vi.fn();
    const user = userEvent.setup();

    render(<ErrorAlert onRetry={handleRetry}>Error</ErrorAlert>);

    await user.click(screen.getByText('Retry'));

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('applies data-testid to retry button', () => {
    render(
      <ErrorAlert data-testid="my-error" onRetry={() => {}}>
        Error
      </ErrorAlert>
    );

    expect(screen.getByTestId('my-error-retry')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <ErrorAlert data-testid="my-error" className="custom-class">
        Error
      </ErrorAlert>
    );

    expect(screen.getByTestId('my-error')).toHaveClass('custom-class');
  });
});
