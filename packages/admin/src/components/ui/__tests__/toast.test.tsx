import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ToastProvider, useToast } from '../toast';

function TestConsumer() {
  const { toast, toasts } = useToast();
  return (
    <div>
      <button type="button" data-testid="trigger-default" onClick={() => toast('Default message')}>
        Default
      </button>
      <button
        type="button"
        data-testid="trigger-success"
        onClick={() => toast('Success message', 'success')}
      >
        Success
      </button>
      <button
        type="button"
        data-testid="trigger-error"
        onClick={() => toast('Error message', 'error')}
      >
        Error
      </button>
      <span data-testid="toast-count">{toasts.length}</span>
    </div>
  );
}

describe('Toast', () => {
  it('renders ToastProvider without crashing', () => {
    render(
      <ToastProvider>
        <p>Content</p>
      </ToastProvider>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('throws when useToast is used outside ToastProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useToast must be used within a ToastProvider');

    spy.mockRestore();
  });

  it('shows toast when triggered', async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider autoDismissMs={0}>
        <TestConsumer />
      </ToastProvider>
    );

    await user.click(screen.getByTestId('trigger-default'));

    expect(screen.getByText('Default message')).toBeInTheDocument();
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  it('shows success toast', async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider autoDismissMs={0}>
        <TestConsumer />
      </ToastProvider>
    );

    await user.click(screen.getByTestId('trigger-success'));

    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('shows error toast', async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider autoDismissMs={0}>
        <TestConsumer />
      </ToastProvider>
    );

    await user.click(screen.getByTestId('trigger-error'));

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('dismisses toast when dismiss button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider autoDismissMs={0}>
        <TestConsumer />
      </ToastProvider>
    );

    await user.click(screen.getByTestId('trigger-default'));
    expect(screen.getByText('Default message')).toBeInTheDocument();

    const dismissButtons = screen.getAllByText('✕');
    await user.click(dismissButtons[0] as HTMLElement);

    expect(screen.queryByText('Default message')).not.toBeInTheDocument();
  });

  it('auto-dismisses toast after timeout', async () => {
    vi.useFakeTimers();

    render(
      <ToastProvider autoDismissMs={3000}>
        <TestConsumer />
      </ToastProvider>
    );

    // Trigger toast using fireEvent instead of userEvent (fake timers conflict)
    await act(async () => {
      screen.getByTestId('trigger-default').click();
    });
    expect(screen.getByText('Default message')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('Default message')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('supports multiple toasts', async () => {
    render(
      <ToastProvider autoDismissMs={0}>
        <TestConsumer />
      </ToastProvider>
    );

    await act(async () => {
      screen.getByTestId('trigger-default').click();
    });
    await act(async () => {
      screen.getByTestId('trigger-success').click();
    });

    expect(screen.getByText('Default message')).toBeInTheDocument();
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByTestId('toast-count')).toHaveTextContent('2');
  });

  it('does not render container when no toasts', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    expect(screen.queryByTestId('toast-container')).not.toBeInTheDocument();
  });

  it('has independent counters across multiple ToastProvider instances', async () => {
    function ConsumerA() {
      const { toast, toasts } = useToast();
      return (
        <div>
          <button type="button" data-testid="trigger-a" onClick={() => toast('Toast A')}>
            A
          </button>
          <span data-testid="ids-a">{toasts.map((t) => t.id).join(',')}</span>
        </div>
      );
    }

    function ConsumerB() {
      const { toast, toasts } = useToast();
      return (
        <div>
          <button type="button" data-testid="trigger-b" onClick={() => toast('Toast B')}>
            B
          </button>
          <span data-testid="ids-b">{toasts.map((t) => t.id).join(',')}</span>
        </div>
      );
    }

    const { unmount } = render(
      <div>
        <ToastProvider autoDismissMs={0}>
          <ConsumerA />
        </ToastProvider>
        <ToastProvider autoDismissMs={0}>
          <ConsumerB />
        </ToastProvider>
      </div>
    );

    await act(async () => {
      screen.getByTestId('trigger-a').click();
    });
    await act(async () => {
      screen.getByTestId('trigger-b').click();
    });

    expect(screen.getByTestId('ids-a')).toHaveTextContent('toast-1');
    expect(screen.getByTestId('ids-b')).toHaveTextContent('toast-1');

    unmount();
  });
});
