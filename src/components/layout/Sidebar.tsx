'use client';

import { FolderOpen, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import FileTreeView from '@/components/sidebar/FileTreeView';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          'fixed top-0 left-0 z-30 flex h-full flex-col',
          'bg-panel border-r border-app',
          'transition-[width] duration-300 ease-in-out overflow-hidden',
          isOpen ? 'w-64' : 'w-0 lg:w-12',
          'lg:relative lg:z-auto lg:shrink-0',
        ].join(' ')}
        aria-label="File tree sidebar"
      >
        {/* Sidebar header */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-app px-3">
          {isOpen && (
            <div className="flex min-w-0 items-center gap-2 text-title">
              <FolderOpen size={16} className="shrink-0 text-primary" />
              <span className="truncate text-sm font-semibold tracking-wide">
                Explorer
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted hover:bg-(--gray-800) hover:text-title"
          >
            {isOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
          </button>
        </div>

        {/* File tree */}
        <div className="min-h-0 flex-1 overflow-y-auto py-2">
          {isOpen && <FileTreeView />}
        </div>
      </aside>
    </>
  );
}
