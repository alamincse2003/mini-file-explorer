'use client';

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
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <aside
        style={{ width: isOpen ? '256px' : '0px' }}
        className={[
          'relative z-30 flex h-full shrink-0 flex-col overflow-hidden',
          'bg-panel',
          'transition-[width] duration-250 ease-in-out',
          'lg:relative lg:z-auto',
        ].join(' ')}
        aria-label="File explorer sidebar"
        aria-hidden={!isOpen}
      >
        {/* Section label */}
        <div className="flex h-8 shrink-0 items-center px-3 pt-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">
            Explorer
          </span>
        </div>

        {/* File tree — fills remaining height */}
        <div className="min-h-0 flex-1 overflow-y-auto pb-4">
          {isOpen && <FileTreeView />}
        </div>
      </aside>
    </>
  );
}
