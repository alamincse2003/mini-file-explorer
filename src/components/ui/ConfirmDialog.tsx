'use client';

import { AlertTriangle } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button on open (safe default for destructive dialogs)
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      {/* Panel — stop propagation so clicking inside doesn't close */}
      <div
        className="w-full max-w-sm overflow-hidden rounded-xl border border-app bg-panel shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3 p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--danger-500)/15">
            <AlertTriangle size={16} className="text-(--danger-500)" />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="confirm-title"
              className="text-sm font-semibold text-title"
            >
              {title}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-muted">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-app px-5 py-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="h-8 rounded-lg border border-app px-3 text-xs font-medium text-muted transition-colors hover:bg-(--gray-800) hover:text-title"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-8 rounded-lg bg-(--danger-500) px-3 text-xs font-medium text-white transition-colors hover:bg-red-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
