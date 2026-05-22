'use client';

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { FileNode } from '@/types';

interface TreeNodeMenuProps {
  node: FileNode;
  onRename: () => void;
  onDelete: () => void;
}

export default function TreeNodeMenu({ node, onRename, onDelete }: TreeNodeMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  function handleRename(e: React.MouseEvent) {
    e.stopPropagation();
    setOpen(false);
    onRename();
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setOpen(false);
    onDelete();
  }

  return (
    <div
      ref={wrapperRef}
      className="relative ml-auto shrink-0"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        aria-label={`Actions for ${node.name}`}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        onBlur={(e) => {
          if (!wrapperRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
        }}
        className="flex h-5 w-5 items-center justify-center rounded text-muted outline-none opacity-0 transition-opacity group-hover:opacity-100 hover:bg-(--gray-700) hover:text-title focus:opacity-100"
      >
        <MoreHorizontal size={12} />
      </button>

      {open && (
        <div className="absolute left-0 top-6 z-50 min-w-[120px] overflow-hidden rounded-lg border border-app bg-panel shadow-xl">
          <button
            onMouseDown={(e) => { e.preventDefault(); handleRename(e); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-paragraph transition-colors hover:bg-(--gray-800) hover:text-title"
          >
            <Pencil size={11} />
            Rename
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); handleDelete(e); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-(--danger-500) transition-colors hover:bg-(--gray-800)"
          >
            <Trash2 size={11} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
