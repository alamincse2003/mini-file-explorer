import { NodeType } from '@/types';
import { ExplorerAction } from './explorerTypes';

export const createSelectNodeAction = (id: string | null): ExplorerAction => ({
  type: 'SELECT_NODE',
  payload: { id },
});

export const createToggleFolderAction = (id: string): ExplorerAction => ({
  type: 'TOGGLE_FOLDER',
  payload: { id },
});

export const createAddNodeAction = (
  parentId: string,
  name: string,
  nodeType: NodeType
): ExplorerAction => ({
  type: 'ADD_NODE',
  payload: { parentId, name, nodeType },
});

export const createDeleteNodeAction = (id: string): ExplorerAction => ({
  type: 'DELETE_NODE',
  payload: { id },
});

export const createRenameNodeAction = (id: string, name: string): ExplorerAction => ({
  type: 'RENAME_NODE',
  payload: { id, name },
});

export const createUpdateFileContentAction = (id: string, content: string): ExplorerAction => ({
  type: 'UPDATE_FILE_CONTENT',
  payload: { id, content },
});

export const createOpenFileAction = (id: string | null): ExplorerAction => ({
  type: 'OPEN_FILE',
  payload: { id },
});
