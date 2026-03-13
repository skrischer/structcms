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

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

/**
 * Minimal dialog component using native <dialog> element with React Portal.
 * Implements focus trapping and restores focus when closed.
 *
 * @example
 * ```tsx
 * <Dialog open={isOpen} onClose={() => setIsOpen(false)} title="Select Media">
 *   <MediaBrowser onSelect={handleSelect} />
 * </Dialog>
 * ```
 */
function Dialog({ open, onClose, children, className, title }: DialogProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const previousActiveElementRef = React.useRef<HTMLElement | null>(null);

  // Handle opening/closing the native dialog
  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      // Save currently focused element before opening
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      if (!dialog.open) {
        dialog.showModal();
      }

      // Focus first focusable element
      const focusableElements = getFocusableElements(dialog);
      if (focusableElements.length > 0) {
        focusableElements[0]?.focus();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }

      // Restore focus to previous element
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
        previousActiveElementRef.current = null;
      }
    }
  }, [open]);

  // Handle focus trapping with Tab key
  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;

    const handleTabKey = (e: KeyboardEvent, elements: HTMLElement[]) => {
      if (elements.length === 0) return;

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];
      const activeElement = document.activeElement;

      if (e.shiftKey) {
        // Shift+Tab: cycle to last element if on first
        if (activeElement === firstElement && lastElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: cycle to first element if on last
        if (activeElement === lastElement && firstElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements(dialog);
        handleTabKey(e, focusableElements);
      }
    };

    dialog.addEventListener('keydown', handleKeyDown);

    return () => {
      dialog.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  // Handle native dialog events
  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    onClose();
  };

  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Close on backdrop click (clicking outside the dialog content)
    const rect = dialog.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!open) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="backdrop:bg-black/50 fixed inset-0 z-50 p-0 bg-transparent"
      data-testid="dialog-overlay"
    >
      <div
        className={cn(
          'relative mx-4 max-h-[85vh] w-full max-w-3xl overflow-auto rounded-lg border border-input bg-background p-6 shadow-lg',
          className
        )}
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
    </dialog>,
    document.body
  );
}

Dialog.displayName = 'Dialog';

export { Dialog };
