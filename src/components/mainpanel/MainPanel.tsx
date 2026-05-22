'use client';

import { FolderOpen } from 'lucide-react';
import { useMemo } from 'react';
import { useExplorer } from '@/context/ExplorerContext';
import { findParentNode } from '@/utils/treeHelpers';
import { FileNode } from '@/types';
import TextEditor from '@/components/editor/TextEditor';
import FileCard from './FileCard';
import FolderCard from './FolderCard';
import Toolbar from './Toolbar';

// ---------------------------------------------------------------------------
// Helpers — local to this module, use the canonical ones from treeHelpers
// for anything shared
// ---------------------------------------------------------------------------

function findNodeById(tree: FileNode, id: string): FileNode | null {
  if (tree.id === id) return tree;
  for (const child of tree.children ?? []) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

function resolveDisplayFolder(
  fileTree: FileNode,
  selectedNodeId: string | null
): FileNode {
  if (!selectedNodeId) return fileTree;
  const selected = findNodeById(fileTree, selectedNodeId);
  if (!selected) return fileTree;
  if (selected.type === 'folder') return selected;
  const parent = findParentNode(fileTree, selectedNodeId);
  return parent ?? fileTree;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function EmptyState({ folderName }: { folderName: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-app bg-(--gray-900)">
        <FolderOpen size={24} className="text-muted" />
      </div>
      <p className="text-sm font-medium text-muted">
        <span className="text-title">{folderName}</span> is empty
      </p>
      <p className="text-xs text-(--gray-600)">
        Use the toolbar above to create a file or folder
      </p>
    </div>
  );
}

interface FolderViewProps {
  displayFolder: FileNode;
}

function FolderView({ displayFolder }: FolderViewProps) {
  const folders = useMemo(
    () => (displayFolder.children ?? []).filter((n) => n.type === 'folder'),
    [displayFolder]
  );
  const files = useMemo(
    () => (displayFolder.children ?? []).filter((n) => n.type === 'file'),
    [displayFolder]
  );
  const isEmpty = folders.length === 0 && files.length === 0;
  const folderName = displayFolder.id === 'root' ? 'Root' : displayFolder.name;

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-app">
      <Toolbar targetFolder={displayFolder} />

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {isEmpty ? (
          <EmptyState folderName={folderName} />
        ) : (
          <div className="flex flex-col gap-6">
            {folders.length > 0 && (
              <section>
                <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted">
                  Folders
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {folders.map((node) => (
                    <FolderCard key={node.id} node={node} />
                  ))}
                </div>
              </section>
            )}

            {files.length > 0 && (
              <section>
                <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted">
                  Files
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {files.map((node) => (
                    <FileCard key={node.id} node={node} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Root — switches between editor and folder view
// ---------------------------------------------------------------------------

export default function MainPanel() {
  const { state, getNodeById } = useExplorer();
  const { fileTree, selectedNodeId, openedFileId } = state;

  const openedFile = useMemo(
    () => (openedFileId ? getNodeById(openedFileId) : null),
    [openedFileId, getNodeById]
  );

  const displayFolder = useMemo(
    () => resolveDisplayFolder(fileTree, selectedNodeId),
    [fileTree, selectedNodeId]
  );

  if (openedFile && openedFile.type === 'file') {
    return (
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-app">
        <TextEditor file={openedFile} />
      </main>
    );
  }

  return <FolderView displayFolder={displayFolder} />;
}
