'use client';

import { Folder } from 'lucide-react';
import { useExplorer } from '@/context/ExplorerContext';
import { useNodeActions } from '@/hooks/useNodeActions';
import { FileNode } from '@/types';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ContextMenu from '@/components/ui/ContextMenu';
import InlineRenameInput from '@/components/ui/InlineRenameInput';

interface FolderCardProps {
  node: FileNode;
}

export default function FolderCard({ node }: FolderCardProps) {
  const { selectNode, toggleFolder } = useExplorer();
  const actions = useNodeActions(node);

  const childCount = node.children?.length ?? 0;

  function handleOpen() {
    selectNode(node.id);
    toggleFolder(node.id);
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onDoubleClick={handleOpen}
        onKeyDown={(e) => { if (e.key === 'Enter') handleOpen(); }}
        aria-label={`Folder: ${node.name}`}
        className={[
          'group relative flex flex-col gap-3 rounded-xl border border-app',
          'bg-panel p-4 transition-all duration-150',
          'cursor-pointer select-none outline-none',
          'hover:border-(--primary-500)/40 hover:bg-(--gray-800)',
          'focus-visible:ring-2 focus-visible:ring-(--primary-500)',
        ].join(' ')}
      >
        {/* Icon + context menu row */}
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--gray-800) transition-colors group-hover:bg-(--gray-700)">
            <Folder size={20} className="text-(--warning-500)" />
          </div>
          <ContextMenu
            onRename={actions.startRename}
            onDelete={actions.requestDelete}
          />
        </div>

        {/* Name / rename input */}
        {actions.renaming ? (
          <InlineRenameInput
            value={actions.renameDraft}
            onChange={actions.setRenameDraft}
            onCommit={actions.commitRename}
            onCancel={actions.cancelRename}
            onKeyDown={actions.onRenameKeyDown}
          />
        ) : (
          <span className="truncate text-sm font-medium text-title">
            {node.name}
          </span>
        )}

        {/* Child count */}
        <span className="text-[11px] text-muted">
          {childCount === 0 ? 'Empty' : `${childCount} item${childCount !== 1 ? 's' : ''}`}
        </span>

        <span className="absolute inset-x-0 bottom-1 text-center text-[10px] text-muted opacity-0 transition-opacity group-hover:opacity-60">
          double-click to open
        </span>
      </div>

      {/* Delete confirmation */}
      {actions.confirmingDelete && (
        <ConfirmDialog
          title={`Delete "${node.name}"?`}
          message={
            childCount > 0
              ? `This will permanently delete "${node.name}" and all ${childCount} item${childCount !== 1 ? 's' : ''} inside it. This cannot be undone.`
              : `"${node.name}" will be permanently deleted.`
          }
          confirmLabel="Delete"
          onConfirm={actions.confirmDelete}
          onCancel={actions.cancelDelete}
        />
      )}
    </>
  );
}
