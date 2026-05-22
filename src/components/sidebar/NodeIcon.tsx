'use client';

import {
  ChevronDown,
  ChevronRight,
  File,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
} from 'lucide-react';
import { NodeType } from '@/types';

interface NodeIconProps {
  nodeType: NodeType;
  name: string;
  isExpanded?: boolean;
}

function fileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['ts', 'tsx', 'js', 'jsx'].includes(ext)) return FileCode;
  if (ext === 'json') return FileJson;
  if (['md', 'txt'].includes(ext)) return FileText;
  return File;
}

export function FolderChevron({ isExpanded }: { isExpanded: boolean }) {
  return isExpanded ? (
    <ChevronDown size={12} className="shrink-0 text-muted" />
  ) : (
    <ChevronRight size={12} className="shrink-0 text-muted" />
  );
}

export function NodeIcon({ nodeType, name, isExpanded = false }: NodeIconProps) {
  if (nodeType === 'folder') {
    const Icon = isExpanded ? FolderOpen : Folder;
    return <Icon size={15} className="shrink-0 text-(--warning-500)" />;
  }

  const Icon = fileIcon(name);
  return <Icon size={15} className="shrink-0 text-(--primary-400)" />;
}
