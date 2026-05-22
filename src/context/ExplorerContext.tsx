'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { initialFileTree } from '@/data/initialData';
import { ExplorerState, FileNode, NodeType } from '@/types';
import { findNodeById } from '@/utils/treeHelpers';
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

const STORAGE_KEY = 'mini-file-explorer-state';

const initialState: ExplorerState = {
  fileTree: initialFileTree,
  selectedNodeId: null,
  expandedFolders: ['root'],
  openedFileId: null,
};

function loadStateFromStorage(): ExplorerState {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as ExplorerState;
    return parsed;
  } catch {
    return initialState;
  }
}

const ExplorerContext = createContext<ExplorerContextValue | null>(null);

export function ExplorerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(explorerReducer, initialState, loadStateFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage may be unavailable in some environments
    }
  }, [state]);

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
