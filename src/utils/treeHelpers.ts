import { FileNode } from '@/types';

// ---------------------------------------------------------------------------
// Read helpers
// ---------------------------------------------------------------------------

export function findNodeById(tree: FileNode, id: string): FileNode | null {
  if (tree.id === id) return tree;
  if (!tree.children?.length) return null;

  for (const child of tree.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

export function findParentNode(tree: FileNode, childId: string): FileNode | null {
  if (!tree.children?.length) return null;

  for (const child of tree.children) {
    if (child.id === childId) return tree;
    const found = findParentNode(child, childId);
    if (found) return found;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Write helpers — every function returns a structurally-shared new tree.
// No node is mutated; only ancestors on the path to the target are replaced.
// ---------------------------------------------------------------------------

export function addNodeToTree(
  tree: FileNode,
  parentId: string,
  newNode: FileNode
): FileNode {
  if (tree.id === parentId) {
    if (tree.type !== 'folder') return tree;
    return {
      ...tree,
      updatedAt: Date.now(),
      children: [...(tree.children ?? []), newNode],
    };
  }

  if (!tree.children?.length) return tree;

  return {
    ...tree,
    children: tree.children.map((child) =>
      addNodeToTree(child, parentId, newNode)
    ),
  };
}

export function deleteNodeFromTree(tree: FileNode, id: string): FileNode {
  if (!tree.children?.length) return tree;

  const nextChildren = tree.children
    .filter((child) => child.id !== id)
    .map((child) => deleteNodeFromTree(child, id));

  return { ...tree, updatedAt: Date.now(), children: nextChildren };
}

export function renameNodeInTree(
  tree: FileNode,
  id: string,
  name: string
): FileNode {
  if (tree.id === id) {
    return { ...tree, name: name.trim(), updatedAt: Date.now() };
  }

  if (!tree.children?.length) return tree;

  return {
    ...tree,
    children: tree.children.map((child) =>
      renameNodeInTree(child, id, name)
    ),
  };
}

export function updateFileContentInTree(
  tree: FileNode,
  id: string,
  content: string
): FileNode {
  if (tree.id === id) {
    return { ...tree, content, updatedAt: Date.now() };
  }

  if (!tree.children?.length) return tree;

  return {
    ...tree,
    children: tree.children.map((child) =>
      updateFileContentInTree(child, id, content)
    ),
  };
}

export function moveNodeInTree(
  tree: FileNode,
  nodeId: string,
  targetParentId: string
): FileNode {
  const nodeToMove = findNodeById(tree, nodeId);
  if (!nodeToMove) return tree;

  const withoutNode = deleteNodeFromTree(tree, nodeId);
  return addNodeToTree(withoutNode, targetParentId, nodeToMove);
}

// ---------------------------------------------------------------------------
// Pure predicate helpers
// ---------------------------------------------------------------------------

export function isDescendant(
  tree: FileNode,
  ancestorId: string,
  descendantId: string
): boolean {
  const ancestor = findNodeById(tree, ancestorId);
  if (!ancestor) return false;
  return findNodeById(ancestor, descendantId) !== null;
}

export function collectAllIds(tree: FileNode): string[] {
  const ids: string[] = [tree.id];
  for (const child of tree.children ?? []) {
    ids.push(...collectAllIds(child));
  }
  return ids;
}
