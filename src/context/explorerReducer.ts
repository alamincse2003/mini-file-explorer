import { ExplorerState, FileNode } from '@/types';
import {
  addNodeToTree,
  deleteNodeFromTree,
  renameNodeInTree,
  updateFileContentInTree,
} from '@/utils/treeHelpers';
import { ExplorerAction } from './explorerTypes';

export function explorerReducer(state: ExplorerState, action: ExplorerAction): ExplorerState {
  switch (action.type) {
    case 'SELECT_NODE': {
      return { ...state, selectedNodeId: action.payload.id };
    }

    case 'TOGGLE_FOLDER': {
      const { id } = action.payload;
      const isExpanded = state.expandedFolders.includes(id);
      return {
        ...state,
        expandedFolders: isExpanded
          ? state.expandedFolders.filter((fid) => fid !== id)
          : [...state.expandedFolders, id],
      };
    }

    case 'ADD_NODE': {
      const { parentId, name, nodeType } = action.payload;
      const now = Date.now();
      const newNode: FileNode = {
        id: `${nodeType}-${now}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        type: nodeType,
        createdAt: now,
        updatedAt: now,
        ...(nodeType === 'folder' ? { children: [] } : { content: '' }),
      };

      const updatedTree = addNodeToTree(state.fileTree, parentId, newNode);
      const expandedFolders = state.expandedFolders.includes(parentId)
        ? state.expandedFolders
        : [...state.expandedFolders, parentId];

      return { ...state, fileTree: updatedTree, expandedFolders };
    }

    case 'DELETE_NODE': {
      const { id } = action.payload;
      const updatedTree = deleteNodeFromTree(state.fileTree, id);
      const selectedNodeId = state.selectedNodeId === id ? null : state.selectedNodeId;
      const openedFileId = state.openedFileId === id ? null : state.openedFileId;
      const expandedFolders = state.expandedFolders.filter((fid) => fid !== id);

      return { ...state, fileTree: updatedTree, selectedNodeId, openedFileId, expandedFolders };
    }

    case 'RENAME_NODE': {
      const { id, name } = action.payload;
      return { ...state, fileTree: renameNodeInTree(state.fileTree, id, name) };
    }

    case 'UPDATE_FILE_CONTENT': {
      const { id, content } = action.payload;
      return { ...state, fileTree: updateFileContentInTree(state.fileTree, id, content) };
    }

    case 'OPEN_FILE': {
      return { ...state, openedFileId: action.payload.id };
    }

    case 'LOAD_STATE': {
      return action.payload;
    }

    default:
      return state;
  }
}
