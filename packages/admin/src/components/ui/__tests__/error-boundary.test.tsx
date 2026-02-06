import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '../error-boundary';

function ThrowingComponent({ message }: { message: string }): never {
  throw new Error(message);
}

let shouldThrow = true;

function ConditionalThrow({ message }: { message: string }) {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <p>Recovered</p>;
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <p>Hello World</p>
      </ErrorBoundary>
    );

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders default error UI when child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingComponent message="Test error" />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();

    spy.mockRestore();
  });

  it('renders custom fallback when provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<p>Custom fallback</p>}>
        <ThrowingComponent message="Test error" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();

    spy.mockRestore();
  });

  it('has alert role on default error UI', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingComponent message="Test error" />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();

    spy.mockRestore();
  });

  it('applies custom className to error UI', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary className="custom-class">
        <ThrowingComponent message="Test error" />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('error-boundary')).toHaveClass('custom-class');

    spy.mockRestore();
  });

  it('renders Retry button in default error UI', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingComponent message="Test error" />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('error-boundary-retry')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();

    spy.mockRestore();
  });

  it('resets error state and re-renders children on Retry click', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();
    shouldThrow = true;

    render(
      <ErrorBoundary>
        <ConditionalThrow message="Test error" />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();

    shouldThrow = false;
    await user.click(screen.getByTestId('error-boundary-retry'));

    expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();
    expect(screen.getByText('Recovered')).toBeInTheDocument();

    spy.mockRestore();
  });

  it('calls onReset callback when Retry is clicked', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const handleReset = vi.fn();
    const user = userEvent.setup();
    shouldThrow = true;

    render(
      <ErrorBoundary onReset={handleReset}>
        <ConditionalThrow message="Test error" />
      </ErrorBoundary>
    );

    shouldThrow = false;
    await user.click(screen.getByTestId('error-boundary-retry'));

    expect(handleReset).toHaveBeenCalledOnce();

    spy.mockRestore();
  });
});
