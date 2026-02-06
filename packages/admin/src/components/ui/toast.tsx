'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

export type ToastVariant = 'default' | 'success' | 'error';

export interface Toast {
  id: string;
  message: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, variant?: ToastVariant) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: React.ReactNode;
  autoDismissMs?: number;
}

/**
 * Provider for toast notifications. Wrap your app with this to enable useToast().
 *
 * @example
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 */
function ToastProvider({ children, autoDismissMs = 5000 }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const counterRef = React.useRef(0);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = React.useCallback(
    (message: string, variant: ToastVariant = 'default') => {
      const id = `toast-${++counterRef.current}`;
      const toast: Toast = { id, message, variant };
      setToasts((prev) => [...prev, toast]);

      if (autoDismissMs > 0) {
        setTimeout(() => removeToast(id), autoDismissMs);
      }
    },
    [autoDismissMs, removeToast]
  );

  const value = React.useMemo(
    () => ({ toasts, addToast, removeToast }),
    [toasts, addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

ToastProvider.displayName = 'ToastProvider';

/**
 * Hook to trigger toast notifications. Must be used within a ToastProvider.
 *
 * @example
 * ```tsx
 * const { toast } = useToast();
 * toast('Page saved!', 'success');
 * toast('Something went wrong', 'error');
 * ```
 */
function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return {
    toast: context.addToast,
    dismiss: context.removeToast,
    toasts: context.toasts,
  };
}

const variantStyles: Record<ToastVariant, string> = {
  default: 'bg-card border-input text-foreground',
  success: 'bg-card border-green-500 text-foreground',
  error: 'bg-card border-destructive text-foreground',
};

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm"
      data-testid="toast-container"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'rounded-md border px-4 py-3 shadow-md flex items-center justify-between gap-2',
            variantStyles[toast.variant ?? 'default']
          )}
          role="alert"
          data-testid={`toast-${toast.id}`}
        >
          <p className="text-sm">{toast.message}</p>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground text-sm"
            onClick={() => onDismiss(toast.id)}
            data-testid={`toast-dismiss-${toast.id}`}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export { ToastProvider, useToast };
