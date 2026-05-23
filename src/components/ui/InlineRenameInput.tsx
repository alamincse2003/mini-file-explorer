'use client';

import { useEffect, useRef } from 'react';

interface InlineRenameInputProps {
  value: string;
  onChange: (v: string) => void;
  onCommit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  className?: string;
}

export default function InlineRenameInput({
  value,
  onChange,
  onCommit,
  onKeyDown,
  className = '',
}: InlineRenameInputProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => ref.current?.select(), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <input
      ref={ref}
      autoFocus
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      onBlur={onCommit}
      onClick={(e) => e.stopPropagation()}
      className={[
        'w-full rounded-md border border-(--primary-500) bg-app',
        'px-1.5 py-0.5 text-sm font-medium text-title',
        'outline-none ring-1 ring-(--primary-500)/40',
        className,
      ].join(' ')}
    />
  );
}
