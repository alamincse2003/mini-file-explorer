'use client';

import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

interface ContextMenuProps {
  onRename: () => void;
  onDelete: () => void;
}

export default function ContextMenu({ onRename, onDelete }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  function handleRename() { setOpen(false); onRename(); }
  function handleDelete() { setOpen(false); onDelete(); }

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        aria-label="More options"
        onClick={() => setOpen((v) => !v)}
        onBlur={(e) => {
          if (!wrapperRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
        }}
        className={[
          'flex h-6 w-6 items-center justify-center rounded-md outline-none',
          'text-muted opacity-0 transition-opacity group-hover:opacity-100',
          'hover:bg-(--gray-700) hover:text-title focus:opacity-100',
          open ? 'opacity-100' : '',
        ].join(' ')}
      >
        <MoreVertical size={13} />
      </button>

      {open && (
        <div className="absolute right-0 top-7 z-40 min-w-32 overflow-hidden rounded-xl border border-app bg-panel shadow-2xl">
          <button
            onMouseDown={(e) => { e.preventDefault(); handleRename(); }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-paragraph hover:bg-(--gray-800) hover:text-title"
          >
            <Pencil size={12} className="shrink-0 text-muted" />
            Rename
          </button>
          <div className="mx-2 h-px bg-(--border-color)" />
          <button
            onMouseDown={(e) => { e.preventDefault(); handleDelete(); }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-(--danger-500) hover:bg-(--gray-800)"
          >
            <Trash2 size={12} className="shrink-0" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
