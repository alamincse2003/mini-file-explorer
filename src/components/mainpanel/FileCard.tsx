'use client';

import { File, FileCode, FileJson, FileText } from 'lucide-react';
import { useExplorer } from '@/context/ExplorerContext';
import { useNodeActions } from '@/hooks/useNodeActions';
import { FileNode } from '@/types';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ContextMenu from '@/components/ui/ContextMenu';
import InlineRenameInput from '@/components/ui/InlineRenameInput';

interface FileCardProps {
  node: FileNode;
}

function resolveIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['ts', 'tsx', 'js', 'jsx'].includes(ext))
    return { Icon: FileCode, color: 'text-(--primary-400)' };
  if (ext === 'json') return { Icon: FileJson, color: 'text-(--warning-500)' };
  if (['md', 'txt'].includes(ext))
    return { Icon: FileText, color: 'text-(--success-500)' };
  return { Icon: File, color: 'text-muted' };
}

function formatSize(bytes: number): string {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

export default function FileCard({ node }: FileCardProps) {
  const { selectNode, openFile } = useExplorer();
  const actions = useNodeActions(node);
  const { Icon, color } = resolveIcon(node.name);

  function handleOpen() {
    selectNode(node.id);
    openFile(node.id);
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onDoubleClick={handleOpen}
        onKeyDown={(e) => { if (e.key === 'Enter') handleOpen(); }}
        aria-label={`File: ${node.name}`}
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
            <Icon size={20} className={color} />
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

        {/* Size */}
        <span className="text-[11px] text-muted">
          {formatSize(node.content?.length ?? 0)}
        </span>

        <span className="absolute inset-x-0 bottom-1 text-center text-[10px] text-muted opacity-0 transition-opacity group-hover:opacity-60">
          double-click to open
        </span>
      </div>

      {/* Delete confirmation */}
      {actions.confirmingDelete && (
        <ConfirmDialog
          title={`Delete "${node.name}"?`}
          message={`"${node.name}" will be permanently deleted. This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={actions.confirmDelete}
          onCancel={actions.cancelDelete}
        />
      )}
    </>
  );
}
