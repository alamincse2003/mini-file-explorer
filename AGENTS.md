# AGENTS.md

## AI Development Rules

Follow strictly for all code generation.

---

## Code Quality Rules

- Use strict TypeScript everywhere
- Never use `any`
- Keep functions small and reusable
- Follow clean naming conventions
- Avoid duplicated logic

---

## Architecture Rules

- Separate UI, logic, and data layers
- Use Context API + useReducer only
- Avoid prop drilling completely
- Keep state normalized and predictable

---

## Component Rules

- Small reusable components only
- No large monolithic components
- Separate presentational and logic components
- Proper props typing required

---

## File Explorer Rules (IMPORTANT)

- Folder delete must recursively delete children
- Tree must support infinite nesting
- Expand/collapse must be smooth
- All operations must use recursive utilities

---

## Performance Rules

- Avoid unnecessary re-renders
- Optimize recursive tree rendering
- Use memoization when needed
- Keep state minimal and normalized

---

## UI Rules

- Modern dark dashboard UI
- Use CSS variables design system
- Maintain consistent spacing
- Add smooth hover transitions
- Fully responsive design required

---

## Styling Rules

- Tailwind CSS only
- No inline styles
- Use utility-first approach

---

## State Safety Rules

- Never mutate state directly
- Always use reducer actions
- Keep logic inside context/reducer layer

---

## Important Rules

- Generate full production-ready implementations
- No placeholder or incomplete code
- Follow modern Next.js App Router patterns
- Ensure clean scalable architecture
