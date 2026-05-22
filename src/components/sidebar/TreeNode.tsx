'use client';

import { memo } from 'react';
import { useExplorer } from '@/context/ExplorerContext';
import { useNodeActions } from '@/hooks/useNodeActions';
import { FileNode } from '@/types';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import InlineRenameInput from '@/components/ui/InlineRenameInput';
import { FolderChevron, NodeIcon } from './NodeIcon';
import TreeNodeMenu from './TreeNodeMenu';

interface TreeNodeProps {
  node: FileNode;
  depth: number;
}

function TreeNode({ node, depth }: TreeNodeProps) {
  const { state, selectNode, toggleFolder, openFile } = useExplorer();
  const actions = useNodeActions(node);

  const isSelected = state.selectedNodeId === node.id;
  const isExpanded = state.expandedFolders.includes(node.id);
  const isFolder = node.type === 'folder';
  const hasChildren = isFolder && (node.children?.length ?? 0) > 0;

  function handleClick() {
    if (actions.renaming) return;
    selectNode(node.id);
    if (isFolder) toggleFolder(node.id);
    else openFile(node.id);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (actions.renaming) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); }
    if (e.key === 'ArrowRight' && isFolder && !isExpanded) toggleFolder(node.id);
    if (e.key === 'ArrowLeft' && isFolder && isExpanded) toggleFolder(node.id);
  }

  return (
    <>
      <li
        role="treeitem"
        aria-expanded={isFolder ? isExpanded : undefined}
        aria-selected={isSelected}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          className={[
            'group flex h-7 cursor-pointer select-none items-center gap-1.5 rounded-md pr-1',
            'text-sm outline-none transition-colors duration-150',
            isSelected
              ? 'bg-primary-soft text-title'
              : 'text-paragraph hover:bg-(--gray-800) hover:text-title',
            'focus-visible:ring-1 focus-visible:ring-(--primary-500)',
          ].join(' ')}
        >
          {/* Chevron column */}
          <span className="flex w-3 shrink-0 items-center justify-center">
            {isFolder && <FolderChevron isExpanded={isExpanded} />}
          </span>

          <NodeIcon nodeType={node.type} name={node.name} isExpanded={isExpanded} />

          {/* Name or rename input */}
          {actions.renaming ? (
            <InlineRenameInput
              value={actions.renameDraft}
              onChange={actions.setRenameDraft}
              onCommit={actions.commitRename}
              onCancel={actions.cancelRename}
              onKeyDown={actions.onRenameKeyDown}
              className="text-xs"
            />
          ) : (
            <span className="min-w-0 flex-1 truncate">{node.name}</span>
          )}

          {/* Per-node action menu — appears on hover */}
          {!actions.renaming && (
            <TreeNodeMenu
              node={node}
              onRename={actions.startRename}
              onDelete={actions.requestDelete}
            />
          )}
        </div>

        {/* Children */}
        {isFolder && isExpanded && hasChildren && (
          <ul role="group" className="mt-0.5">
            {node.children!.map((child) => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </ul>
        )}
      </li>

      {/* Delete confirmation rendered at root to escape stacking context */}
      {actions.confirmingDelete && (
        <ConfirmDialog
          title={`Delete "${node.name}"?`}
          message={
            isFolder && hasChildren
              ? `This will permanently delete "${node.name}" and everything inside it. This cannot be undone.`
              : `"${node.name}" will be permanently deleted. This cannot be undone.`
          }
          confirmLabel="Delete"
          onConfirm={actions.confirmDelete}
          onCancel={actions.cancelDelete}
        />
      )}
    </>
  );
}

export default memo(TreeNode);
