"use client";

import {
  ArrowLeft,
  Check,
  File,
  FileCode,
  FileJson,
  FileText,
  Save,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useExplorer } from "@/context/ExplorerContext";
import { FileNode } from "@/types";

function resolveFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["ts", "tsx", "js", "jsx"].includes(ext))
    return { Icon: FileCode, color: "text-(--primary-400)" };
  if (ext === "json") return { Icon: FileJson, color: "text-(--warning-500)" };
  if (["md", "txt"].includes(ext))
    return { Icon: FileText, color: "text-(--success-500)" };
  return { Icon: File, color: "text-muted" };
}

function resolveLanguageLabel(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    ts: "TypeScript",
    tsx: "TSX",
    js: "JavaScript",
    jsx: "JSX",
    json: "JSON",
    md: "Markdown",
    txt: "Plain Text",
    css: "CSS",
    html: "HTML",
    py: "Python",
  };
  return (map[ext] ?? ext.toUpperCase()) || "Text";
}

// Editor header

interface EditorHeaderProps {
  file: FileNode;
  isDirty: boolean;
  isSaved: boolean;
  onSave: () => void;
  onClose: () => void;
}

function EditorHeader({
  file,
  isDirty,
  isSaved,
  onSave,
  onClose,
}: EditorHeaderProps) {
  const { Icon, color } = resolveFileIcon(file.name);
  const lang = resolveLanguageLabel(file.name);

  return (
    <div className="flex h-10 shrink-0 items-center gap-2 border-b border-app bg-panel px-2">
      <button
        onClick={onClose}
        aria-label="Back to folder view"
        title="Back to folder view"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted hover:bg-(--gray-800) hover:text-title"
      >
        <ArrowLeft size={14} />
      </button>

      {/* Tab pill */}
      <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden rounded-md border border-app bg-(--gray-900) px-2.5 py-1">
        <Icon size={13} className={`shrink-0 ${color}`} />
        <span className="truncate text-xs font-medium text-title">
          {file.name}
        </span>
        {isDirty && (
          <span
            title="Unsaved changes"
            className="ml-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-(--primary-500)"
          />
        )}
      </div>

      <span className="hidden shrink-0 text-[11px] text-muted sm:block">
        {lang}
      </span>

      <button
        onClick={onSave}
        disabled={!isDirty}
        aria-label="Save file"
        title="Save (Ctrl+S)"
        className={[
          "flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium",
          isSaved
            ? "bg-(--success-500)/15 text-(--success-500)"
            : isDirty
              ? "bg-(--primary-600) text-white hover:bg-(--primary-700)"
              : "cursor-default text-muted opacity-40",
        ].join(" ")}
      >
        {isSaved ? (
          <>
            <Check size={12} /> Saved
          </>
        ) : (
          <>
            <Save size={12} /> Save
          </>
        )}
      </button>
    </div>
  );
}

// Editor footer

function EditorFooter({
  lines,
  chars,
  col,
}: {
  lines: number;
  chars: number;
  col: number;
}) {
  return (
    <div className="flex h-6 shrink-0 items-center gap-4 border-t border-app bg-panel px-3">
      <span className="text-[11px] text-muted">
        Ln {lines}, Col {col}
      </span>
      <span className="text-[11px] text-muted">
        {chars.toLocaleString()} chars
      </span>
    </div>
  );
}

//  Main editor

export default function TextEditor({ file }: { file: FileNode }) {
  const { updateFileContent, openFile } = useExplorer();

  const [draft, setDraft] = useState(file.content ?? "");
  const [isSaved, setIsSaved] = useState(false);
  const [cursorCol, setCursorCol] = useState(1);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isDirty = draft !== (file.content ?? "");

  // Sync draft on file switch
  useEffect(() => {
    setDraft(file.content ?? "");
    setIsSaved(false);
    setCursorCol(1);
  }, [file.id, file.content]);

  const save = useCallback(() => {
    if (!isDirty) return;
    updateFileContent(file.id, draft);
    setIsSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setIsSaved(false), 2000);
  }, [isDirty, draft, file.id, updateFileContent]);

  // Ctrl+S / Cmd+S
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  // Timer cleanup
  useEffect(
    () => () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    },
    [],
  );

  function updateCursorPos() {
    const el = textareaRef.current;
    if (!el) return;
    const before = el.value.slice(0, el.selectionStart);
    const linesBefore = before.split("\n");
    setCursorCol(linesBefore[linesBefore.length - 1].length + 1);
  }

  const lines = draft.split("\n").length;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <EditorHeader
        file={file}
        isDirty={isDirty}
        isSaved={isSaved}
        onSave={save}
        onClose={() => openFile(null)}
      />

      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          updateCursorPos();
        }}
        onKeyUp={updateCursorPos}
        onClick={updateCursorPos}
        spellCheck={false}
        aria-label={`Editor for ${file.name}`}
        className={[
          "min-h-0 flex-1 resize-none bg-app p-5",
          "font-mono text-[13px] leading-6 text-title",
          "outline-none placeholder:text-muted",
          "selection:bg-(--primary-500)/25",
        ].join(" ")}
        placeholder="Empty file — start typing…"
      />

      <EditorFooter lines={lines} chars={draft.length} col={cursorCol} />
    </div>
  );
}
