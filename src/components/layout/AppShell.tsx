'use client';

import { useState } from 'react';
import MainPanel from './MainPanel';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-app">
      <Topbar onSidebarToggle={toggleSidebar} isSidebarOpen={sidebarOpen} />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

        {/* Thin separator line between sidebar and main */}
        <div className="w-px shrink-0 bg-(--border-subtle)" />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <MainPanel />
        </div>
      </div>
    </div>
  );
}
