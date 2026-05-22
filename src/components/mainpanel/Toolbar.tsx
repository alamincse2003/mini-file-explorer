'use client';

import { FilePlus, FolderPlus } from 'lucide-react';
import { useState } from 'react';
import { useExplorer } from '@/context/ExplorerContext';
import { FileNode } from '@/types';

interface ToolbarProps {
  targetFolder: FileNode;
}

type CreatingType = 'folder' | 'file' | null;

export default function Toolbar({ targetFolder }: ToolbarProps) {
  const { addNode, selectNode } = useExplorer();
  const [creating, setCreating] = useState<CreatingType>(null);
  const [name, setName] = useState('');

  function startCreate(type: 'folder' | 'file') {
    setName('');
    setCreating(type);
  }

  function commit() {
    const trimmed = name.trim();
    if (!trimmed || !creating) return cancel();
    addNode(targetFolder.id, trimmed, creating);
    selectNode(null);
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

  const placeholder = creating === 'folder' ? 'Folder name…' : 'File name (e.g. index.ts)…';

  return (
    <div className="flex shrink-0 flex-col gap-2 border-b border-app bg-panel px-4 py-2.5">
      <div className="flex items-center gap-2">
        {/* Breadcrumb title */}
        <span className="min-w-0 flex-1 truncate text-xs font-semibold uppercase tracking-widest text-muted">
          {targetFolder.id === 'root' ? 'Root' : targetFolder.name}
        </span>

        <button
          onClick={() => startCreate('folder')}
          title="New folder"
          aria-label="Create new folder"
          className="flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted transition-colors hover:bg-(--gray-800) hover:text-title"
        >
          <FolderPlus size={14} />
          <span className="hidden sm:inline">New Folder</span>
        </button>

        <button
          onClick={() => startCreate('file')}
          title="New file"
          aria-label="Create new file"
          className="flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted transition-colors hover:bg-(--gray-800) hover:text-title"
        >
          <FilePlus size={14} />
          <span className="hidden sm:inline">New File</span>
        </button>
      </div>

      {/* Inline name input */}
      {creating && (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={cancel}
            placeholder={placeholder}
            className={[
              'h-7 flex-1 rounded-md border bg-app px-2.5 text-xs text-title',
              'border-app outline-none transition-colors',
              'placeholder:text-muted',
              'focus:border-(--primary-500) focus:ring-1 focus:ring-(--primary-500)',
            ].join(' ')}
          />
          <button
            onMouseDown={(e) => { e.preventDefault(); commit(); }}
            className="h-7 rounded-md bg-(--primary-600) px-2.5 text-xs font-medium text-white transition-colors hover:bg-(--primary-700)"
          >
            Create
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); cancel(); }}
            className="h-7 rounded-md border border-app px-2.5 text-xs text-muted transition-colors hover:bg-(--gray-800) hover:text-title"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
