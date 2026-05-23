'use client';

import { FolderOpen, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface TopbarProps {
  onSidebarToggle: () => void;
  isSidebarOpen: boolean;
}

export default function Topbar({ onSidebarToggle, isSidebarOpen }: TopbarProps) {
  return (
    <header className="flex h-11 shrink-0 items-center gap-0 border-b border-app bg-panel">
      {/* Sidebar toggle — always visible, aligns with sidebar header */}
      <button
        onClick={onSidebarToggle}
        aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        className={[
          'flex h-11 w-12 shrink-0 items-center justify-center',
          'text-muted hover:bg-(--gray-800) hover:text-title',
          'border-r border-app',
        ].join(' ')}
      >
        {isSidebarOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
      </button>

      {/* Brand */}
      <div className="flex items-center gap-2 px-4">
        <FolderOpen size={15} className="shrink-0 text-primary" />
        <span className="text-sm font-semibold tracking-wide text-title">
          Mini File Explorer
        </span>
      </div>

      {/* Right slot */}
      <div className="ml-auto flex items-center gap-3 px-4">
        <span className="hidden text-[11px] font-medium text-muted sm:block">
          Next.js · TypeScript · Tailwind
        </span>
      </div>
    </header>
  );
}
