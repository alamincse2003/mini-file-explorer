# Mini File Explorer — Project Structure & Data Flow

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + CSS Variables |
| State | Context API + useReducer |
| Icons | Lucide React |
| Persistence | localStorage (debounced, versioned) |

---

## Folder Structure

```
src/
├── app/
│   ├── globals.css          # Design system — CSS variables, base styles, utilities
│   ├── layout.tsx           # Root layout — mounts ExplorerProvider, Geist fonts
│   └── page.tsx             # Entry point — renders AppShell
│
├── types/
│   └── index.ts             # FileNode, NodeType, ExplorerState
│
├── data/
│   └── initialData.ts       # Default mock file tree (seed data)
│
├── lib/
│   └── storage.ts           # localStorage read/write with schema validation + versioning
│
├── context/
│   ├── explorerTypes.ts     # ExplorerAction union type, ExplorerContextValue interface
│   ├── explorerActions.ts   # Pure action creator functions
│   ├── explorerReducer.ts   # Pure reducer — all state transitions
│   └── ExplorerContext.tsx  # Provider, useExplorer hook, debounced persistence
│
├── utils/
│   └── treeHelpers.ts       # Pure recursive tree functions (no mutation)
│
├── hooks/
│   ├── useInlineRename.ts   # (legacy) simple rename state — superseded by useNodeActions
│   └── useNodeActions.ts    # All per-node CRUD logic (rename, delete, create child)
│
└── components/
    ├── layout/
    │   ├── AppShell.tsx     # Top-level shell — sidebar toggle state, layout grid
    │   ├── Topbar.tsx       # App header — brand, sidebar toggle button
    │   ├── Sidebar.tsx      # Collapsible sidebar shell — mounts FileTreeView
    │   └── MainPanel.tsx    # Re-export shim → components/mainpanel/MainPanel
    │
    ├── sidebar/
    │   ├── FileTreeView.tsx # Root of the tree — renders top-level TreeNodes
    │   ├── TreeNode.tsx     # Recursive node — expand/collapse, rename, delete
    │   ├── TreeNodeMenu.tsx # Hover action dropdown (Rename / Delete) for tree rows
    │   └── NodeIcon.tsx     # FolderChevron + NodeIcon (ext-aware file icons)
    │
    ├── mainpanel/
    │   ├── MainPanel.tsx    # Switches between FolderView and TextEditor
    │   ├── Toolbar.tsx      # Breadcrumb path + New Folder / New File buttons
    │   ├── FolderCard.tsx   # Grid card for folders — double-click to navigate
    │   └── FileCard.tsx     # Grid card for files — double-click to open editor
    │
    ├── editor/
    │   └── TextEditor.tsx   # Full textarea editor — save, Ctrl+S, dirty indicator
    │
    └── ui/
        ├── ConfirmDialog.tsx    # Modal — used for destructive delete confirmation
        ├── ContextMenu.tsx      # Dropdown (Rename / Delete) for grid cards
        └── InlineRenameInput.tsx # Controlled input for in-place name editing
```

---

## Core Types

```ts
// Every node in the tree
interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: FileNode[];   // folders only
  content?: string;        // files only
  createdAt: number;
  updatedAt: number;
}

// Full application state (single source of truth)
interface ExplorerState {
  fileTree: FileNode;          // the entire virtual filesystem
  selectedNodeId: string | null;
  expandedFolders: string[];   // IDs of open folders in the sidebar
  openedFileId: string | null; // file currently open in the editor
}
```

---

## State Flow

```
User action
    │
    ▼
Component (pure UI)
    │  calls context helper (selectNode / addNode / deleteNode / etc.)
    ▼
useNodeActions hook  ──────────────────────────────┐
    │  (optional: holds renaming/confirmingDelete   │
    │   local UI state before dispatching)          │
    ▼                                               │
ExplorerContext.dispatch(action)                    │
    │                                               │
    ▼                                               │
explorerReducer(state, action)                      │
    │  calls pure treeHelpers                       │
    │  returns new ExplorerState (no mutation)      │
    ▼                                               │
New state in Context                                │
    │                                               │
    ├──▶ Components re-render (React diffing)       │
    │                                               │
    └──▶ useEffect → saveState() [debounced 400ms]  │
              │                                     │
              ▼                                     │
         localStorage ──── loadState() on init ─────┘
```

---

## Reducer Actions

| Action | Payload | What it does |
|---|---|---|
| `SELECT_NODE` | `{ id }` | Sets `selectedNodeId` |
| `TOGGLE_FOLDER` | `{ id }` | Adds/removes id from `expandedFolders` |
| `ADD_NODE` | `{ parentId, name, nodeType }` | Creates new node, auto-expands parent |
| `DELETE_NODE` | `{ id }` | Recursively removes node + clears selection/openedFile |
| `RENAME_NODE` | `{ id, name }` | Updates name in-place (immutable copy) |
| `UPDATE_FILE_CONTENT` | `{ id, content }` | Updates file content string |
| `OPEN_FILE` | `{ id \| null }` | Sets `openedFileId` (null = close editor) |
| `LOAD_STATE` | `ExplorerState` | Bulk-replace state (used by storage init) |

---

## Tree Helper Functions (`utils/treeHelpers.ts`)

All functions are **pure** — they take a tree and return a new tree. No node is ever mutated.

```
findNodeById(tree, id)              → FileNode | null
findParentNode(tree, childId)       → FileNode | null
addNodeToTree(tree, parentId, node) → FileNode  (new tree)
deleteNodeFromTree(tree, id)        → FileNode  (new tree)
renameNodeInTree(tree, id, name)    → FileNode  (new tree)
updateFileContentInTree(tree, id, content) → FileNode (new tree)
moveNodeInTree(tree, nodeId, targetParentId) → FileNode (new tree)
isDescendant(tree, ancestorId, descendantId) → boolean
collectAllIds(tree)                 → string[]
```

Structural sharing: only nodes on the ancestor path to the changed node are replaced. Siblings and unrelated subtrees share the same object references — React's `===` diffing skips re-rendering unchanged branches.

---

## LocalStorage Persistence (`lib/storage.ts`)

```
Write path:
  state change → useEffect (debounced 400ms)
              → saveState()
              → { version: 1, state } → JSON.stringify → localStorage

  beforeunload → immediate flush (no debounce)

Read path (app boot):
  loadState() → localStorage.getItem
             → JSON.parse
             → version check (mismatch → defaultState)
             → isValidState() shape validation
             → returns ExplorerState or defaultState on any failure
```

Failures handled silently: JSON parse errors, `QuotaExceededError`, SSR (no window), schema version mismatch, any missing or wrong-typed field.

---

## Component Responsibilities

### Layout layer
| Component | Owns |
|---|---|
| `AppShell` | `sidebarOpen` boolean state, layout grid |
| `Topbar` | Sidebar toggle button, brand display |
| `Sidebar` | Animated width, mobile backdrop, mounts `FileTreeView` |

### Sidebar layer
| Component | Owns |
|---|---|
| `FileTreeView` | Root children list, empty state |
| `TreeNode` | One node row — expand/collapse, select, rename, delete; recurses for children |
| `TreeNodeMenu` | Hover dropdown anchored to a tree row |
| `NodeIcon` | Icon + chevron resolution by file extension |

### Main panel layer
| Component | Owns |
|---|---|
| `MainPanel` | Switches between `FolderView` and `TextEditor` |
| `Toolbar` | Breadcrumb navigation, New Folder / New File with inline input |
| `FolderCard` | Folder grid card — double-click navigates into folder |
| `FileCard` | File grid card — double-click opens editor |

### Editor layer
| Component | Owns |
|---|---|
| `TextEditor` | Draft state, dirty tracking, Ctrl+S save, cursor position, header + footer |

### UI primitives
| Component | Owns |
|---|---|
| `ConfirmDialog` | Modal backdrop, Escape key, focus management |
| `ContextMenu` | Card dropdown (Rename / Delete), blur-to-close |
| `InlineRenameInput` | Controlled input, auto-select-all on mount |

---

## Hook Responsibilities

### `useNodeActions(node)`
Central logic hook consumed by `TreeNode`, `FolderCard`, and `FileCard`.

```
Exposes:
  rename  → renaming, renameDraft, setRenameDraft,
            startRename, commitRename, cancelRename, onRenameKeyDown

  delete  → confirmingDelete,
            requestDelete, confirmDelete, cancelDelete

  create  → creating, createDraft, setCreateDraft,
            startCreate, commitCreate, cancelCreate, onCreateKeyDown
```

All operations ultimately call context helpers (`renameNode`, `deleteNode`, `addNode`) which dispatch to the reducer.

### `useInlineRename(id, currentName)`
Earlier simpler hook — still present but superseded by `useNodeActions` for new components.

---

## Data Flow: Create a File

```
1. User clicks "New File" in Toolbar
2. Toolbar local state: creating = 'file', shows input
3. User types name, presses Enter
4. Toolbar calls addNode(folderId, name, 'file')
5. ExplorerContext dispatches ADD_NODE
6. Reducer calls addNodeToTree() → returns new immutable tree
7. New state propagates → FileCard appears in grid
8. useEffect fires → debounced saveState() → localStorage updated
```

## Data Flow: Delete a Folder

```
1. User clicks ⋮ → Delete on FolderCard or TreeNode
2. useNodeActions: confirmingDelete = true
3. ConfirmDialog renders (portal over all content)
4. User clicks "Delete"
5. useNodeActions.confirmDelete():
     openFile(null)       // close editor if open
     selectNode(null)     // clear selection
     deleteNode(id)       // dispatch DELETE_NODE
6. Reducer calls deleteNodeFromTree() → recursive removal
7. expandedFolders filtered, selectedNodeId/openedFileId cleared
8. New state propagates → node gone from sidebar + grid
9. Debounced saveState() → localStorage updated
```

## Data Flow: Edit and Save a File

```
1. User double-clicks FileCard (or presses Enter)
2. openFile(id) dispatched → openedFileId set
3. MainPanel detects openedFileId → renders TextEditor
4. TextEditor: draft = file.content (local state, not in context)
5. User types → draft updates, isDirty = true, save button activates
6. User presses Ctrl+S (or clicks Save)
7. updateFileContent(id, draft) dispatched → UPDATE_FILE_CONTENT
8. Reducer calls updateFileContentInTree() → new immutable tree
9. Debounced saveState() → localStorage updated
10. isDirty resets to false, "Saved" flash shown for 2s
```
