'use client';

import { useRef, useState } from 'react';
import { useExplorer } from '@/context/ExplorerContext';

export function useInlineRename(id: string, currentName: string) {
  const { renameNode } = useExplorer();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(currentName);
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setDraft(currentName);
    setEditing(true);
    // Focus after paint
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function commitEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== currentName) renameNode(id, trimmed);
    setEditing(false);
  }

  function cancelEdit() {
    setDraft(currentName);
    setEditing(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') cancelEdit();
  }

  return { editing, draft, setDraft, inputRef, startEdit, commitEdit, cancelEdit, onKeyDown };
}
