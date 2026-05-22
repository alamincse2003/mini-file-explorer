"use client";

import {
  ArrowLeft,
  Check,
  FileCode,
  FileJson,
  FileText,
  File,
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
    <div className="flex h-11 shrink-0 items-center gap-2 border-b border-app bg-panel px-3">
      <button
        onClick={onClose}
        aria-label="Back to folder view"
        title="Back to folder view"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-(--gray-800) hover:text-title"
      >
        <ArrowLeft size={14} />
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Icon size={14} className={`shrink-0 ${color}`} />
        <span className="truncate text-sm font-medium text-title">
          {file.name}
        </span>
        {isDirty && (
          <span
            title="Unsaved changes"
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-(--primary-500)"
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
          "flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all",
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

interface EditorFooterProps {
  lines: number;
  chars: number;
}

function EditorFooter({ lines, chars }: EditorFooterProps) {
  return (
    <div className="flex h-6 shrink-0 items-center gap-4 border-t border-app bg-panel px-3">
      <span className="text-[11px] text-muted">Ln {lines}</span>
      <span className="text-[11px] text-muted">{chars} chars</span>
    </div>
  );
}

// Main editor

interface TextEditorProps {
  file: FileNode;
}

export default function TextEditor({ file }: TextEditorProps) {
  const { updateFileContent, openFile } = useExplorer();

  const [draft, setDraft] = useState(file.content ?? "");
  const [isSaved, setIsSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDirty = draft !== (file.content ?? "");

  // Sync draft when the opened file changes (different file selected)
  useEffect(() => {
    setDraft(file.content ?? "");
    setIsSaved(false);
  }, [file.id, file.content]);

  const save = useCallback(() => {
    if (!isDirty) return;
    updateFileContent(file.id, draft);

    setIsSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setIsSaved(false), 2000);
  }, [isDirty, draft, file.id, updateFileContent]);

  // Ctrl+S / Cmd+S keyboard shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [save]);

  // Clean up timer on unmount
  useEffect(
    () => () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    },
    [],
  );

  const lines = draft.split("\n").length;
  const chars = draft.length;

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
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        spellCheck={false}
        aria-label={`Editor for ${file.name}`}
        className={[
          "min-h-0 flex-1 resize-none bg-app p-4",
          "font-mono text-sm leading-relaxed text-title",
          "outline-none placeholder:text-muted",
          "selection:bg-(--primary-500)/30",
        ].join(" ")}
        placeholder="Empty file — start typing…"
      />

      <EditorFooter lines={lines} chars={chars} />
    </div>
  );
}
