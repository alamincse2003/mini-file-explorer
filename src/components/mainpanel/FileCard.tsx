'use client';

import {
  File,
  FileCode,
  FileJson,
  FileText,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useExplorer } from '@/context/ExplorerContext';
import { useInlineRename } from '@/hooks/useInlineRename';
import { FileNode } from '@/types';

interface FileCardProps {
  node: FileNode;
}

function resolveIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['ts', 'tsx', 'js', 'jsx'].includes(ext)) return { Icon: FileCode, color: 'text-(--primary-400)' };
  if (ext === 'json') return { Icon: FileJson, color: 'text-(--warning-500)' };
  if (['md', 'txt'].includes(ext)) return { Icon: FileText, color: 'text-(--success-500)' };
  return { Icon: File, color: 'text-muted' };
}

export default function FileCard({ node }: FileCardProps) {
  const { selectNode, openFile, deleteNode } = useExplorer();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const rename = useInlineRename(node.id, node.name);
  const { Icon, color } = resolveIcon(node.name);

  const byteCount = node.content?.length ?? 0;
  const sizeLabel = byteCount < 1024
    ? `${byteCount} B`
    : `${(byteCount / 1024).toFixed(1)} KB`;

  function handleOpen() {
    selectNode(node.id);
    openFile(node.id);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setMenuOpen(false);
    deleteNode(node.id);
  }

  function handleRename(e: React.MouseEvent) {
    e.stopPropagation();
    setMenuOpen(false);
    rename.startEdit();
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onDoubleClick={handleOpen}
      onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
      aria-label={`File: ${node.name}`}
      className={[
        'group relative flex flex-col gap-3 rounded-xl border border-app',
        'bg-panel p-4 transition-all duration-150',
        'cursor-pointer select-none outline-none',
        'hover:border-(--primary-500)/40 hover:bg-(--gray-800)',
        'focus-visible:ring-2 focus-visible:ring-(--primary-500)',
      ].join(' ')}
    >
      {/* Icon row */}
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--gray-800) group-hover:bg-(--gray-700) transition-colors">
          <Icon size={20} className={color} />
        </div>

        {/* Context menu trigger */}
        <div ref={menuRef} className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            aria-label="More options"
            onClick={() => setMenuOpen((v) => !v)}
            onBlur={(e) => {
              if (!menuRef.current?.contains(e.relatedTarget as Node)) setMenuOpen(false);
            }}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:bg-(--gray-700) hover:text-title focus:opacity-100 outline-none"
          >
            <MoreVertical size={13} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-7 z-40 min-w-[120px] overflow-hidden rounded-lg border border-app bg-panel shadow-xl">
              <button
                onClick={handleRename}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-paragraph hover:bg-(--gray-800) hover:text-title"
              >
                <Pencil size={12} /> Rename
              </button>
              <button
                onClick={handleDelete}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-(--danger-500) hover:bg-(--gray-800)"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      {rename.editing ? (
        <input
          ref={rename.inputRef}
          autoFocus
          type="text"
          value={rename.draft}
          onChange={(e) => rename.setDraft(e.target.value)}
          onKeyDown={rename.onKeyDown}
          onBlur={rename.commitEdit}
          onClick={(e) => e.stopPropagation()}
          className="w-full rounded border border-(--primary-500) bg-app px-1.5 py-0.5 text-sm font-medium text-title outline-none"
        />
      ) : (
        <span className="truncate text-sm font-medium text-title">{node.name}</span>
      )}

      {/* Meta */}
      <span className="text-[11px] text-muted">{sizeLabel}</span>

      {/* Open hint */}
      <span className="absolute inset-x-0 bottom-1 text-center text-[10px] text-muted opacity-0 transition-opacity group-hover:opacity-60">
        double-click to open
      </span>
    </div>
  );
}
