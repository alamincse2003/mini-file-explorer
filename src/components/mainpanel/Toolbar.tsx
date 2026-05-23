'use client';

import { FilePlus, FolderPlus, ChevronRight, Home } from 'lucide-react';
import { useState } from 'react';
import { useExplorer } from '@/context/ExplorerContext';
import { FileNode } from '@/types';
import { findParentNode } from '@/utils/treeHelpers';

interface ToolbarProps {
  targetFolder: FileNode;
}

type CreatingType = 'folder' | 'file' | null;

export default function Toolbar({ targetFolder }: ToolbarProps) {
  const { state, addNode, selectNode } = useExplorer();
  const [creating, setCreating] = useState<CreatingType>(null);
  const [name, setName] = useState('');

  const isRoot = targetFolder.id === 'root';
  const parent = isRoot ? null : findParentNode(state.fileTree, targetFolder.id);

  function startCreate(type: 'folder' | 'file') {
    setName('');
    setCreating(type);
  }

  function commit() {
    const trimmed = name.trim();
    if (!trimmed || !creating) return cancel();
    addNode(targetFolder.id, trimmed, creating);
    cancel();
  }

  function cancel() {
    setCreating(null);
    setName('');
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') cancel();
  }

  return (
    <div className="flex shrink-0 flex-col gap-0 border-b border-app bg-panel">
      {/* Top row: breadcrumb + actions */}
      <div className="flex h-10 items-center gap-1 px-3">
        {/* Breadcrumb */}
        <nav aria-label="Folder path" className="flex min-w-0 flex-1 items-center gap-0.5 overflow-hidden">
          <button
            onClick={() => selectNode(null)}
            aria-label="Root"
            className="flex items-center gap-1 rounded px-1 py-0.5 text-xs text-muted transition-colors hover:text-title"
          >
            <Home size={11} />
          </button>
          {parent && parent.id !== 'root' && (
            <>
              <ChevronRight size={11} className="shrink-0 text-faint" />
              <button
                onClick={() => selectNode(parent.id)}
                className="max-w-20 truncate rounded px-1 py-0.5 text-xs text-muted transition-colors hover:text-title"
              >
                {parent.name}
              </button>
            </>
          )}
          {!isRoot && (
            <>
              <ChevronRight size={11} className="shrink-0 text-faint" />
              <span className="max-w-30 truncate rounded px-1 py-0.5 text-xs font-medium text-title">
                {targetFolder.name}
              </span>
            </>
          )}
        </nav>

        {/* Divider */}
        <div className="mx-1 h-4 w-px bg-(--border-color)" />

        {/* Action buttons */}
        <button
          onClick={() => startCreate('folder')}
          title="New folder"
          aria-label="Create new folder"
          className="flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted transition-colors hover:bg-(--gray-800) hover:text-title"
        >
          <FolderPlus size={13} />
          <span className="hidden sm:inline">New Folder</span>
        </button>

        <button
          onClick={() => startCreate('file')}
          title="New file"
          aria-label="Create new file"
          className="flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted transition-colors hover:bg-(--gray-800) hover:text-title"
        >
          <FilePlus size={13} />
          <span className="hidden sm:inline">New File</span>
        </button>
      </div>

      {/* Inline creation input */}
      {creating && (
        <div className="flex items-center gap-2 border-t border-app px-3 py-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-app bg-app px-2.5 focus-within:border-(--primary-500) focus-within:ring-1 focus-within:ring-(--primary-500)">
            {creating === 'folder'
              ? <FolderPlus size={12} className="shrink-0 text-muted" />
              : <FilePlus size={12} className="shrink-0 text-muted" />
            }
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={onKeyDown}
              onBlur={cancel}
              placeholder={creating === 'folder' ? 'Folder name…' : 'File name (e.g. index.ts)…'}
              className="h-7 min-w-0 flex-1 bg-transparent text-xs text-title placeholder:text-muted outline-none"
            />
          </div>
          <button
            onMouseDown={(e) => { e.preventDefault(); commit(); }}
            className="h-7 rounded-md bg-(--primary-600) px-3 text-xs font-medium text-white hover:bg-(--primary-700)"
          >
            Create
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); cancel(); }}
            className="h-7 rounded-md border border-app px-3 text-xs text-muted hover:bg-(--gray-800) hover:text-title"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
