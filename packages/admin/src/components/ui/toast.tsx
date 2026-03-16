'use client';

import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../lib/utils';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  title?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, variant?: ToastVariant, title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: React.ReactNode;
  autoDismissMs?: number;
}

function ToastProvider({ children, autoDismissMs = 5000 }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const counterRef = React.useRef(0);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = React.useCallback(
    (message: string, variant: ToastVariant = 'default', title?: string) => {
      const id = `toast-${++counterRef.current}`;
      const toast: Toast = { id, message, variant, title };
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

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  default: null,
  success: <CheckCircle size={20} strokeWidth={1.5} className="text-[#22C55E] shrink-0 mt-px" />,
  error: <XCircle size={20} strokeWidth={1.5} className="text-[#EF4444] shrink-0 mt-px" />,
  warning: <AlertTriangle size={20} strokeWidth={1.5} className="text-[#F59E0B] shrink-0 mt-px" />,
  info: <Info size={20} strokeWidth={1.5} className="text-[#3B82F6] shrink-0 mt-px" />,
};

const compactIcons: Record<ToastVariant, React.ReactNode> = {
  default: null,
  success: <CheckCircle size={16} strokeWidth={2} className="text-[#22C55E] shrink-0" />,
  error: <XCircle size={16} strokeWidth={2} className="text-[#EF4444] shrink-0" />,
  warning: <AlertTriangle size={16} strokeWidth={2} className="text-[#F59E0B] shrink-0" />,
  info: <Info size={16} strokeWidth={2} className="text-[#3B82F6] shrink-0" />,
};

export interface ToastItemProps {
  variant?: ToastVariant;
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
  'data-testid'?: string;
  dismissTestId?: string;
}

function ToastItem({
  variant = 'default',
  title,
  message,
  onDismiss,
  className,
  'data-testid': testId,
  dismissTestId,
}: ToastItemProps) {
  const isCompact = !title;

  if (isCompact) {
    return (
      <div
        className={cn(
          'flex items-center rounded-lg py-2.5 px-3.5 gap-2.5 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]',
          className
        )}
        role="alert"
        data-testid={testId}
      >
        {compactIcons[variant]}
        <p className="text-[14px] text-[#1E293B] leading-[18px] grow">{message}</p>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0"
            aria-label="Dismiss"
            data-testid={dismissTestId}
          >
            <X size={14} strokeWidth={1.5} className="text-[#94A3B8]" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-start rounded-lg gap-3 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] p-4',
        className
      )}
      role="alert"
      data-testid={testId}
    >
      {variantIcons[variant]}
      <div className="flex flex-col grow gap-0.5">
        <p className="text-[14px] font-medium text-[#0F172A] leading-[18px]">{title}</p>
        <p className="text-[13px] text-[#64748B] leading-4">{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0"
          aria-label="Dismiss"
          data-testid={dismissTestId}
        >
          <X size={16} strokeWidth={1.5} className="text-[#94A3B8]" />
        </button>
      )}
    </div>
  );
}

ToastItem.displayName = 'ToastItem';

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
        <ToastItem
          key={toast.id}
          variant={toast.variant}
          title={toast.title}
          message={toast.message}
          onDismiss={() => onDismiss(toast.id)}
          data-testid={`toast-${toast.id}`}
          dismissTestId={`toast-dismiss-${toast.id}`}
        />
      ))}
    </div>
  );
}

export { ToastProvider, useToast, ToastItem };
