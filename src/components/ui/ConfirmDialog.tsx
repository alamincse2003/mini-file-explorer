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

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-app bg-panel shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Body */}
        <div className="flex items-start gap-4 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--danger-500)/10">
            <AlertTriangle size={17} className="text-(--danger-500)" />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h2 id="confirm-title" className="text-sm font-semibold text-title">
              {title}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">{message}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-app px-5 py-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="h-8 rounded-lg border border-app px-4 text-xs font-medium text-muted hover:bg-(--gray-800) hover:text-title"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-8 rounded-lg bg-(--danger-500) px-4 text-xs font-medium text-white hover:bg-(--danger-600)"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
