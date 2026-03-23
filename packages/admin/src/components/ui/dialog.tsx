"use client";

import { X } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
  footer?: React.ReactNode;
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  );
}

function openDialog(
  dialog: HTMLDialogElement,
  previousActiveElementRef: React.MutableRefObject<HTMLElement | null>,
) {
  previousActiveElementRef.current = document.activeElement as HTMLElement;
  if (!dialog.open) {
    dialog.showModal();
  }
  const focusableElements = getFocusableElements(dialog);
  if (focusableElements.length > 0) {
    focusableElements[0]?.focus();
  }
}

function closeDialog(
  dialog: HTMLDialogElement,
  previousActiveElementRef: React.MutableRefObject<HTMLElement | null>,
) {
  if (dialog.open) {
    dialog.close();
  }
  if (previousActiveElementRef.current) {
    previousActiveElementRef.current.focus();
    previousActiveElementRef.current = null;
  }
}

function trapFocus(e: KeyboardEvent, elements: HTMLElement[]) {
  if (elements.length === 0) return;
  const firstElement = elements[0];
  const lastElement = elements[elements.length - 1];
  const activeElement = document.activeElement;

  if (e.shiftKey) {
    if (activeElement === firstElement && lastElement) {
      e.preventDefault();
      lastElement.focus();
    }
  } else {
    if (activeElement === lastElement && firstElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
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
function Dialog({
  open,
  onClose,
  children,
  className,
  title,
  footer,
}: DialogProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const previousActiveElementRef = React.useRef<HTMLElement | null>(null);

  // Handle opening/closing the native dialog
  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      openDialog(dialog, previousActiveElementRef);
    } else {
      closeDialog(dialog, previousActiveElementRef);
    }
  }, [open]);

  // Handle focus trapping with Tab key
  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        trapFocus(e, getFocusableElements(dialog));
      }
    };

    dialog.addEventListener("keydown", handleKeyDown);
    return () => {
      dialog.removeEventListener("keydown", handleKeyDown);
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
    if (e.key === "Escape") {
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
      className="backdrop:bg-black/50 fixed inset-0 z-50 p-0 bg-transparent flex items-center justify-center"
      data-structcms-admin=""
      data-testid="dialog-overlay"
    >
      <div
        className={cn(
          "relative mx-4 max-h-[85vh] w-full max-w-3xl overflow-auto rounded-xl bg-[var(--admin-surface-card)] shadow-xl",
          className,
        )}
        data-testid="dialog-content"
      >
        {title && (
          <div className="flex items-center justify-between p-6 pb-0">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm p-1 text-muted-foreground hover:text-foreground"
              aria-label="Close"
              data-testid="dialog-close"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        )}
        <div className="p-6 pt-4">{children}</div>
        {footer && (
          <div className="border-t border-[var(--admin-border-default)] bg-[var(--admin-gray-50)] px-6 py-4 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </dialog>,
    document.body,
  );
}

Dialog.displayName = "Dialog";

export { Dialog };
