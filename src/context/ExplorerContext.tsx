'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';

import { FileNode, NodeType } from '@/types';
import { findNodeById } from '@/utils/treeHelpers';
import { loadState, saveState } from '@/lib/storage';
import {
  createAddNodeAction,
  createDeleteNodeAction,
  createOpenFileAction,
  createRenameNodeAction,
  createSelectNodeAction,
  createToggleFolderAction,
  createUpdateFileContentAction,
} from './explorerActions';
import { explorerReducer } from './explorerReducer';
import { ExplorerContextValue } from './explorerTypes';

// ---------------------------------------------------------------------------
// How long to wait after the last state change before writing to localStorage.
// Editor keystrokes dispatch UPDATE_FILE_CONTENT on every character; without
// debouncing this would serialise the entire tree on every keystroke.
// ---------------------------------------------------------------------------
const PERSIST_DEBOUNCE_MS = 400;

const ExplorerContext = createContext<ExplorerContextValue | null>(null);

export function ExplorerProvider({ children }: { children: React.ReactNode }) {
  // loadState() runs once as the useReducer initialiser — it is called during
  // the first render only and never on subsequent renders.
  const [state, dispatch] = useReducer(explorerReducer, undefined, loadState);

  // ----- Debounced persistence -----
  // We keep a timer ref rather than putting it in state so that scheduling /
  // cancelling the write never triggers a re-render.
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (persistTimer.current) clearTimeout(persistTimer.current);

    persistTimer.current = setTimeout(() => {
      saveState(state);
    }, PERSIST_DEBOUNCE_MS);

    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, [state]);

  // Flush immediately before the tab closes so no data is lost between the
  // last debounced write and the unload event.
  useEffect(() => {
    function onBeforeUnload() {
      if (persistTimer.current) {
        clearTimeout(persistTimer.current);
        persistTimer.current = null;
      }
      saveState(state);
    }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // ----- Action helpers -----
  const selectNode = useCallback((id: string | null) => {
    dispatch(createSelectNodeAction(id));
  }, []);

  const toggleFolder = useCallback((id: string) => {
    dispatch(createToggleFolderAction(id));
  }, []);

  const addNode = useCallback((parentId: string, name: string, nodeType: NodeType) => {
    dispatch(createAddNodeAction(parentId, name, nodeType));
  }, []);

  const deleteNode = useCallback((id: string) => {
    dispatch(createDeleteNodeAction(id));
  }, []);

  const renameNode = useCallback((id: string, name: string) => {
    dispatch(createRenameNodeAction(id, name));
  }, []);

  const updateFileContent = useCallback((id: string, content: string) => {
    dispatch(createUpdateFileContentAction(id, content));
  }, []);

  const openFile = useCallback((id: string | null) => {
    dispatch(createOpenFileAction(id));
  }, []);

  const getNodeById = useCallback(
    (id: string): FileNode | null => findNodeById(state.fileTree, id),
    [state.fileTree]
  );

  const value = useMemo<ExplorerContextValue>(
    () => ({
      state,
      dispatch,
      selectNode,
      toggleFolder,
      addNode,
      deleteNode,
      renameNode,
      updateFileContent,
      openFile,
      getNodeById,
    }),
    [
      state,
      selectNode,
      toggleFolder,
      addNode,
      deleteNode,
      renameNode,
      updateFileContent,
      openFile,
      getNodeById,
    ]
  );

  return <ExplorerContext.Provider value={value}>{children}</ExplorerContext.Provider>;
}

export function useExplorer(): ExplorerContextValue {
  const ctx = useContext(ExplorerContext);
  if (!ctx) {
    throw new Error('useExplorer must be used within an ExplorerProvider');
  }
  return ctx;
}
