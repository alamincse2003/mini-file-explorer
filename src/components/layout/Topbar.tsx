'use client';

import { FolderOpen, PanelLeftOpen } from 'lucide-react';

interface TopbarProps {
  onSidebarToggle: () => void;
  isSidebarOpen: boolean;
}

export default function Topbar({ onSidebarToggle, isSidebarOpen }: TopbarProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-app bg-panel px-4">
      {!isSidebarOpen && (
        <button
          onClick={onSidebarToggle}
          aria-label="Open sidebar"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-(--gray-800) hover:text-title lg:hidden"
        >
          <PanelLeftOpen size={15} />
        </button>
      )}

      <div className="flex items-center gap-2">
        <FolderOpen size={16} className="text-primary" />
        <span className="text-sm font-semibold text-title tracking-wide">
          Mini File Explorer
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden text-xs text-muted sm:block">
          Next.js · TypeScript · Tailwind
        </span>
      </div>
    </header>
  );
}
