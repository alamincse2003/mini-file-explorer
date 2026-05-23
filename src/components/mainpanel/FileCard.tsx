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
    return { Icon: FileCode, color: 'text-(--primary-400)', bg: 'bg-(--primary-950)' };
  if (ext === 'json')
    return { Icon: FileJson, color: 'text-(--warning-500)', bg: 'bg-(--gray-800)' };
  if (['md', 'txt'].includes(ext))
    return { Icon: FileText, color: 'text-(--success-500)', bg: 'bg-(--gray-800)' };
  return { Icon: File, color: 'text-muted', bg: 'bg-(--gray-800)' };
}

function formatSize(bytes: number): string {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

export default function FileCard({ node }: FileCardProps) {
  const { selectNode, openFile } = useExplorer();
  const actions = useNodeActions(node);
  const { Icon, color, bg } = resolveIcon(node.name);

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
          'group relative flex flex-col gap-3 rounded-xl border border-app bg-panel p-4',
          'cursor-pointer select-none outline-none card-hover',
          'hover:border-(--primary-500)/30 hover:bg-raised',
          'focus-visible:ring-2 focus-visible:ring-(--primary-500)',
        ].join(' ')}
      >
        {/* Icon + menu row */}
        <div className="flex items-start justify-between">
          <div className={[
            'flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-150',
            bg,
            'group-hover:brightness-125',
          ].join(' ')}>
            <Icon size={19} className={color} />
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
            {formatSize(node.content?.length ?? 0)}
          </span>
          <span className="text-[10px] text-muted opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            ↵ open
          </span>
        </div>
      </div>

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
