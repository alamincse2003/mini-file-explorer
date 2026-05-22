# Mini File Explorer Project

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Context API + useReducer
- Lucide React

---

## Project Goal

Build a modern mini file explorer like a desktop file manager with recursive folder structure.

---

## Features

- Recursive folder tree
- Expand / collapse folders
- Create folder
- Create text file
- Rename items
- Delete items (recursive delete)
- Text file editor
- LocalStorage persistence
- Responsive UI

---

## Architecture Rules

- Use reusable components only
- Keep components small and focused
- Use functional components only
- Use App Router
- Strict TypeScript required
- Avoid `any`
- Separate UI, logic, and data layers

---

## State Management (IMPORTANT)

Use Context API + useReducer

State must include:

- fileTree: FileNode
- selectedNodeId: string | null
- expandedFolders: string[]
- openedFileId: string | null

---

## Reducer Rules

All state updates must go through reducer actions:

- SELECT_NODE
- TOGGLE_FOLDER
- ADD_NODE
- DELETE_NODE
- RENAME_NODE
- UPDATE_FILE_CONTENT

Never mutate state directly.

---

## Tree Logic Rules (CRITICAL)

All file operations must use pure recursive helper functions:

- findNodeById
- addNodeToTree
- deleteNodeFromTree
- renameNodeInTree
- updateFileContentInTree

NO direct mutation allowed.

---

## Styling Rules

- Tailwind CSS only
- Use CSS variables design system
- Dark modern dashboard UI
- Smooth transitions
- Responsive design
- Clean spacing system

---

## Design System (CSS Variables)

Use custom variables from globals.css:

- primary color scale
- gray scale
- semantic colors (success, danger, warning)
- text hierarchy colors

---

## Folder Structure

src/
├── app/
├── components/
├── context/
├── utils/
├── hooks/
├── types/
└── data/

---

## Important Rules

- No placeholder code
- Production-ready implementation required
- No unnecessary libraries
- Keep code scalable and maintainable
