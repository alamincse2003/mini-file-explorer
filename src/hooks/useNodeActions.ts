'use client';

import { useState } from 'react';
import { useExplorer } from '@/context/ExplorerContext';
import { FileNode, NodeType } from '@/types';

export interface NodeActions {
  // rename
  renaming: boolean;
  renameDraft: string;
  setRenameDraft: (v: string) => void;
  startRename: () => void;
  commitRename: () => void;
  cancelRename: () => void;
  onRenameKeyDown: (e: React.KeyboardEvent) => void;

  // delete
  confirmingDelete: boolean;
  requestDelete: () => void;
  confirmDelete: () => void;
  cancelDelete: () => void;

  // create child (only meaningful on folders)
  creating: NodeType | null;
  createDraft: string;
  setCreateDraft: (v: string) => void;
  startCreate: (type: NodeType) => void;
  commitCreate: () => void;
  cancelCreate: () => void;
  onCreateKeyDown: (e: React.KeyboardEvent) => void;
}

export function useNodeActions(node: FileNode): NodeActions {
  const { selectNode, toggleFolder, openFile, deleteNode, renameNode, addNode } =
    useExplorer();

  // ----- rename -----
  const [renaming, setRenaming] = useState(false);
  const [renameDraft, setRenameDraft] = useState(node.name);

  function startRename() {
    setRenameDraft(node.name);
    setRenaming(true);
  }

  function commitRename() {
    const trimmed = renameDraft.trim();
    if (trimmed && trimmed !== node.name) renameNode(node.id, trimmed);
    setRenaming(false);
  }

  function cancelRename() {
    setRenameDraft(node.name);
    setRenaming(false);
  }

  function onRenameKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); commitRename(); }
    if (e.key === 'Escape') cancelRename();
  }

  // ----- delete -----
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function requestDelete() { setConfirmingDelete(true); }
  function cancelDelete() { setConfirmingDelete(false); }

  function confirmDelete() {
    setConfirmingDelete(false);
    // If the deleted node is open, close it first
    if (node.type === 'file') openFile(null);
    selectNode(null);
    deleteNode(node.id);
  }

  // ----- create child (folders only) -----
  const [creating, setCreating] = useState<NodeType | null>(null);
  const [createDraft, setCreateDraft] = useState('');

  function startCreate(type: NodeType) {
    setCreateDraft('');
    setCreating(type);
    // Auto-expand the folder so the new node is visible
    if (node.type === 'folder') toggleFolder(node.id);
  }

  function commitCreate() {
    const trimmed = createDraft.trim();
    if (trimmed && creating) {
      addNode(node.id, trimmed, creating);
      selectNode(null);
    }
    cancelCreate();
  }

  function cancelCreate() {
    setCreating(null);
    setCreateDraft('');
  }

  function onCreateKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); commitCreate(); }
    if (e.key === 'Escape') cancelCreate();
  }

  return {
    renaming,
    renameDraft,
    setRenameDraft,
    startRename,
    commitRename,
    cancelRename,
    onRenameKeyDown,
    confirmingDelete,
    requestDelete,
    confirmDelete,
    cancelDelete,
    creating,
    createDraft,
    setCreateDraft,
    startCreate,
    commitCreate,
    cancelCreate,
    onCreateKeyDown,
  };
}
