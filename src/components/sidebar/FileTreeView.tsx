'use client';

import { useExplorer } from '@/context/ExplorerContext';
import TreeNode from './TreeNode';

export default function FileTreeView() {
  const { state } = useExplorer();
  const rootChildren = state.fileTree.children ?? [];

  if (rootChildren.length === 0) {
    return (
      <p className="px-4 py-3 text-xs text-muted">
        No files yet. Create a file or folder to get started.
      </p>
    );
  }

  return (
    <ul role="tree" aria-label="File tree" className="px-1">
      {rootChildren.map((node) => (
        <TreeNode key={node.id} node={node} depth={0} />
      ))}
    </ul>
  );
}
