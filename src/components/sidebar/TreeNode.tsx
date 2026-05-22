'use client';

import { memo } from 'react';
import { useExplorer } from '@/context/ExplorerContext';
import { FileNode } from '@/types';
import { FolderChevron, NodeIcon } from './NodeIcon';

interface TreeNodeProps {
  node: FileNode;
  depth: number;
}

function TreeNode({ node, depth }: TreeNodeProps) {
  const { state, selectNode, toggleFolder, openFile } = useExplorer();

  const isSelected = state.selectedNodeId === node.id;
  const isExpanded = state.expandedFolders.includes(node.id);
  const isFolder = node.type === 'folder';
  const hasChildren = isFolder && (node.children?.length ?? 0) > 0;

  const handleClick = () => {
    selectNode(node.id);
    if (isFolder) {
      toggleFolder(node.id);
    } else {
      openFile(node.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
    if (e.key === 'ArrowRight' && isFolder && !isExpanded) toggleFolder(node.id);
    if (e.key === 'ArrowLeft' && isFolder && isExpanded) toggleFolder(node.id);
  };

  return (
    <li role="treeitem" aria-expanded={isFolder ? isExpanded : undefined} aria-selected={isSelected}>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        className={[
          'group flex h-7 cursor-pointer select-none items-center gap-1.5 rounded-md pr-2',
          'text-sm outline-none transition-colors duration-150',
          isSelected
            ? 'bg-primary-soft text-title'
            : 'text-paragraph hover:bg-(--gray-800) hover:text-title',
          'focus-visible:ring-1 focus-visible:ring-(--primary-500)',
        ].join(' ')}
      >
        {/* Chevron column — always reserves space so files align with folders */}
        <span className="flex w-3 shrink-0 items-center justify-center">
          {isFolder && <FolderChevron isExpanded={isExpanded} />}
        </span>

        <NodeIcon nodeType={node.type} name={node.name} isExpanded={isExpanded} />

        <span className="min-w-0 flex-1 truncate">{node.name}</span>

        {isFolder && !hasChildren && (
          <span className="ml-auto shrink-0 text-[10px] text-muted opacity-0 transition-opacity group-hover:opacity-100">
            empty
          </span>
        )}
      </div>

      {isFolder && isExpanded && hasChildren && (
        <ul role="group" className="mt-0.5">
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default memo(TreeNode);
