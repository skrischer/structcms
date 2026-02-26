'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

/**
 * Minimal dialog component using React Portal.
 * Renders a modal overlay with backdrop that closes on outside click or Escape key.
 *
 * @example
 * ```tsx
 * <Dialog open={isOpen} onClose={() => setIsOpen(false)} title="Select Media">
 *   <MediaBrowser onSelect={handleSelect} />
 * </Dialog>
 * ```
 */
function Dialog({ open, onClose, children, className, title }: DialogProps) {
  const overlayRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      }}
      // biome-ignore lint/a11y/useSemanticElements: Dialog overlay backdrop, not a semantic button
      role="button"
      tabIndex={-1}
      data-testid="dialog-overlay"
    >
      <div
        className={cn(
          'relative mx-4 max-h-[85vh] w-full max-w-3xl overflow-auto rounded-lg border border-input bg-background p-6 shadow-lg',
          className
        )}
        // biome-ignore lint/a11y/useSemanticElements: Using div with role for flexibility, native <dialog> has styling limitations
        role="dialog"
        aria-modal="true"
        aria-label={title}
        data-testid="dialog-content"
      >
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm p-1 text-muted-foreground hover:text-foreground"
              aria-label="Close"
              data-testid="dialog-close"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}

Dialog.displayName = 'Dialog';

export { Dialog };
