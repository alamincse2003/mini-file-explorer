'use client';

import { FolderOpen } from 'lucide-react';
import { useExplorer } from '@/context/ExplorerContext';
import TreeNode from './TreeNode';

export default function FileTreeView() {
  const { state } = useExplorer();
  const rootChildren = state.fileTree.children ?? [];

  if (rootChildren.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-app bg-(--gray-900)">
          <FolderOpen size={18} className="text-muted" />
        </div>
        <p className="text-xs font-medium text-muted">No files yet</p>
        <p className="text-[11px] text-faint leading-relaxed">
          Use the main panel to create a file or folder
        </p>
      </div>
    );
  }

  return (
    <ul role="tree" aria-label="File tree" className="px-1 pt-1">
      {rootChildren.map((node) => (
        <TreeNode key={node.id} node={node} depth={0} />
      ))}
    </ul>
  );
}
