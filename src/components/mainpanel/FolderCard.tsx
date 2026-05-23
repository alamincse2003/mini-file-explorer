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
          'group relative flex flex-col gap-3 rounded-xl border border-app bg-panel p-4',
          'cursor-pointer select-none outline-none card-hover',
          'hover:border-(--primary-500)/30 hover:bg-raised',
          'focus-visible:ring-2 focus-visible:ring-(--primary-500)',
        ].join(' ')}
      >
        {/* Icon + menu row */}
        <div className="flex items-start justify-between">
          <div className={[
            'flex h-10 w-10 items-center justify-center rounded-xl',
            'bg-(--gray-800) transition-colors duration-150 group-hover:bg-(--gray-700)',
          ].join(' ')}>
            <Folder size={19} className="text-(--warning-500)" />
          </div>
          <ContextMenu onRename={actions.startRename} onDelete={actions.requestDelete} />
        </div>

        {/* Name */}
        {actions.renaming ? (
          <InlineRenameInput
            value={actions.renameDraft}
            onChange={actions.setRenameDraft}
            onCommit={actions.commitRename}
            onKeyDown={actions.onRenameKeyDown}
          />
        ) : (
          <span className="truncate text-sm font-medium text-title leading-tight">
            {node.name}
          </span>
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted">
            {childCount === 0 ? 'Empty' : `${childCount} item${childCount !== 1 ? 's' : ''}`}
          </span>
          <span className="text-[10px] text-muted opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            ↵ open
          </span>
        </div>
      </div>

      {actions.confirmingDelete && (
        <ConfirmDialog
          title={`Delete "${node.name}"?`}
          message={
            childCount > 0
              ? `This permanently deletes "${node.name}" and all ${childCount} item${childCount !== 1 ? 's' : ''} inside. This cannot be undone.`
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
