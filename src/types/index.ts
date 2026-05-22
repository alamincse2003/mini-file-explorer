export type NodeType = 'folder' | 'file';

export interface FileNode {
  id: string;
  name: string;
  type: NodeType;
  children?: FileNode[];
  content?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ExplorerState {
  fileTree: FileNode;
  selectedNodeId: string | null;
  expandedFolders: string[];
  openedFileId: string | null;
}
