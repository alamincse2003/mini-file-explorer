'use client';

import { FileText } from 'lucide-react';

export default function MainPanel() {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-app">
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-(--gray-900) border border-app">
            <FileText size={24} className="text-muted" />
          </div>
          <p className="text-sm font-medium text-muted">
            Select a file to view its contents
          </p>
          <p className="text-xs text-(--gray-600)">
            Use the sidebar to browse and open files
          </p>
        </div>
      </div>
    </main>
  );
}
