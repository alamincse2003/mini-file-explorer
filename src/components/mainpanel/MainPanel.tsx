"use client";

import { FilePlus, FolderOpen, FolderPlus } from "lucide-react";
import { useMemo } from "react";
import { useExplorer } from "@/context/ExplorerContext";
import { findParentNode } from "@/utils/treeHelpers";
import { FileNode } from "@/types";
import TextEditor from "@/components/editor/TextEditor";
import FileCard from "./FileCard";
import FolderCard from "./FolderCard";
import Toolbar from "./Toolbar";

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
  selectedNodeId: string | null,
): FileNode {
  if (!selectedNodeId) return fileTree;
  const selected = findNodeById(fileTree, selectedNodeId);
  if (!selected) return fileTree;
  if (selected.type === "folder") return selected;
  return findParentNode(fileTree, selectedNodeId) ?? fileTree;
}

// Empty state

function EmptyState({
  folderName,
  onCreateFolder,
  onCreateFile,
}: {
  folderName: string;
  onCreateFolder: () => void;
  onCreateFile: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-app bg-raised">
        <FolderOpen size={28} className="text-muted" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-title">
          {folderName === "Root" ? "No files yet" : `"${folderName}" is empty`}
        </p>
        <p className="text-xs text-muted">
          Create a file or folder to get started
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onCreateFolder}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-app bg-raised px-3 text-xs font-medium text-paragraph transition-colors hover:bg-(--gray-800) hover:text-title"
        >
          <FolderPlus size={13} /> New Folder
        </button>
        <button
          onClick={onCreateFile}
          className="flex h-8 items-center gap-1.5 rounded-lg bg-(--primary-600) px-3 text-xs font-medium text-white transition-colors hover:bg-(--primary-700)"
        >
          <FilePlus size={13} /> New File
        </button>
      </div>
    </div>
  );
}

// Section heading

function SectionLabel({ label, count }: { label: string; count: number }) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">
        {label}
      </span>
      <span className="rounded-full bg-(--gray-800) px-1.5 py-px text-[10px] font-medium text-muted">
        {count}
      </span>
    </div>
  );
}

// Folder view

interface FolderViewProps {
  displayFolder: FileNode;
}

function FolderView({ displayFolder }: FolderViewProps) {
  const { addNode } = useExplorer();

  const folders = useMemo(
    () => (displayFolder.children ?? []).filter((n) => n.type === "folder"),
    [displayFolder],
  );
  const files = useMemo(
    () => (displayFolder.children ?? []).filter((n) => n.type === "file"),
    [displayFolder],
  );
  const isEmpty = folders.length === 0 && files.length === 0;
  const folderName = displayFolder.id === "root" ? "Root" : displayFolder.name;

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-app">
      <Toolbar targetFolder={displayFolder} />

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {isEmpty ? (
          <EmptyState
            folderName={folderName}
            onCreateFolder={() =>
              addNode(displayFolder.id, "New Folder", "folder")
            }
            onCreateFile={() =>
              addNode(displayFolder.id, "untitled.txt", "file")
            }
          />
        ) : (
          <div className="flex flex-col gap-7">
            {folders.length > 0 && (
              <section>
                <SectionLabel label="Folders" count={folders.length} />
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {folders.map((node) => (
                    <FolderCard key={node.id} node={node} />
                  ))}
                </div>
              </section>
            )}

            {files.length > 0 && (
              <section>
                <SectionLabel label="Files" count={files.length} />
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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

// Root switcher

export default function MainPanel() {
  const { state, getNodeById } = useExplorer();
  const { fileTree, selectedNodeId, openedFileId } = state;

  const openedFile = useMemo(
    () => (openedFileId ? getNodeById(openedFileId) : null),
    [openedFileId, getNodeById],
  );

  const displayFolder = useMemo(
    () => resolveDisplayFolder(fileTree, selectedNodeId),
    [fileTree, selectedNodeId],
  );

  if (openedFile && openedFile.type === "file") {
    return (
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-app">
        <TextEditor file={openedFile} />
      </main>
    );
  }

  return <FolderView displayFolder={displayFolder} />;
}
