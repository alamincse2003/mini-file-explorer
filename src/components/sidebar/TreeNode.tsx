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
          style={{ paddingLeft: `${depth * 12 + 6}px` }}
          className={[
            'group flex h-6.5 cursor-pointer select-none items-center gap-1 rounded-md pr-1',
            'text-[13px] outline-none',
            'transition-colors duration-100',
            isSelected
              ? 'bg-primary-soft text-title'
              : 'text-paragraph hover:bg-(--gray-800) hover:text-title',
            'focus-visible:ring-1 focus-visible:ring-(--primary-500)',
          ].join(' ')}
        >
          {/* Chevron slot — fixed width keeps files aligned with folders */}
          <span className="flex w-3 shrink-0 items-center justify-center">
            {isFolder && <FolderChevron isExpanded={isExpanded} />}
          </span>

          <NodeIcon nodeType={node.type} name={node.name} isExpanded={isExpanded} />

          {actions.renaming ? (
            <InlineRenameInput
              value={actions.renameDraft}
              onChange={actions.setRenameDraft}
              onCommit={actions.commitRename}
              onKeyDown={actions.onRenameKeyDown}
              className="text-xs"
            />
          ) : (
            <span className="min-w-0 flex-1 truncate">{node.name}</span>
          )}

          {!actions.renaming && (
            <TreeNodeMenu
              node={node}
              onRename={actions.startRename}
              onDelete={actions.requestDelete}
            />
          )}
        </div>

        {/* Animated children container */}
        {isFolder && isExpanded && hasChildren && (
          <ul role="group" className="mt-px">
            {node.children!.map((child) => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </ul>
        )}
      </li>

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
