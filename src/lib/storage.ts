import { ExplorerState, FileNode } from "@/types";
import { initialFileTree } from "@/data/initialData";

const STORAGE_KEY = "mini-file-explorer-state";
const SCHEMA_VERSION = 1;

interface PersistedEnvelope {
  version: number;
  state: ExplorerState;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isValidFileNode(v: unknown): v is FileNode {
  if (!isPlainObject(v)) return false;
  if (typeof v.id !== "string" || !v.id) return false;
  if (typeof v.name !== "string" || !v.name) return false;
  if (v.type !== "folder" && v.type !== "file") return false;
  if (typeof v.createdAt !== "number") return false;
  if (typeof v.updatedAt !== "number") return false;

  if (v.type === "folder") {
    if (v.children !== undefined && !Array.isArray(v.children)) return false;
    if (Array.isArray(v.children) && !v.children.every(isValidFileNode))
      return false;
  }

  if (v.type === "file") {
    if (v.content !== undefined && typeof v.content !== "string") return false;
  }

  return true;
}

function isValidState(v: unknown): v is ExplorerState {
  if (!isPlainObject(v)) return false;
  if (!isValidFileNode(v.fileTree)) return false;
  if (v.selectedNodeId !== null && typeof v.selectedNodeId !== "string")
    return false;
  if (!Array.isArray(v.expandedFolders)) return false;
  if (!v.expandedFolders.every((id: unknown) => typeof id === "string"))
    return false;
  if (v.openedFileId !== null && typeof v.openedFileId !== "string")
    return false;
  return true;
}

// Public API

export const defaultState: ExplorerState = {
  fileTree: initialFileTree,
  selectedNodeId: null,
  expandedFolders: ["root"],
  openedFileId: null,
};

export function loadState(): ExplorerState {
  if (typeof window === "undefined") return defaultState;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;

    const envelope: unknown = JSON.parse(raw);

    // Version mismatch → discard and start fresh rather than crash
    if (!isPlainObject(envelope) || envelope.version !== SCHEMA_VERSION) {
      return defaultState;
    }

    const candidate = envelope.state;

    if (!isValidState(candidate)) {
      console.warn(
        "[storage] Persisted state failed validation — using default.",
      );
      return defaultState;
    }

    return candidate;
  } catch (err) {
    // JSON.parse failure, quota read error, etc.
    console.warn("[storage] Failed to load state from localStorage:", err);
    return defaultState;
  }
}

export function saveState(state: ExplorerState): void {
  if (typeof window === "undefined") return;

  try {
    const envelope: PersistedEnvelope = { version: SCHEMA_VERSION, state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
  } catch (err) {
    // QuotaExceededError or serialisation failure — log but never throw.
    // The app continues working in-memory; user is not interrupted.
    console.warn("[storage] Failed to persist state to localStorage:", err);
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
