import { ExplorerState, FileNode, NodeType } from '@/types';

export type ExplorerAction =
  | { type: 'SELECT_NODE'; payload: { id: string | null } }
  | { type: 'TOGGLE_FOLDER'; payload: { id: string } }
  | { type: 'ADD_NODE'; payload: { parentId: string; name: string; nodeType: NodeType } }
  | { type: 'DELETE_NODE'; payload: { id: string } }
  | { type: 'RENAME_NODE'; payload: { id: string; name: string } }
  | { type: 'UPDATE_FILE_CONTENT'; payload: { id: string; content: string } }
  | { type: 'OPEN_FILE'; payload: { id: string | null } }
  | { type: 'LOAD_STATE'; payload: ExplorerState };

export interface ExplorerContextValue {
  state: ExplorerState;
  dispatch: React.Dispatch<ExplorerAction>;
  selectNode: (id: string | null) => void;
  toggleFolder: (id: string) => void;
  addNode: (parentId: string, name: string, nodeType: NodeType) => void;
  deleteNode: (id: string) => void;
  renameNode: (id: string, name: string) => void;
  updateFileContent: (id: string, content: string) => void;
  openFile: (id: string | null) => void;
  getNodeById: (id: string) => FileNode | null;
}
