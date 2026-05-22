import { FileNode } from '@/types';

export const initialFileTree: FileNode = {
  id: 'root',
  name: 'root',
  type: 'folder',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  children: [
    {
      id: 'folder-src',
      name: 'src',
      type: 'folder',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      children: [
        {
          id: 'folder-components',
          name: 'components',
          type: 'folder',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          children: [
            {
              id: 'file-button',
              name: 'Button.tsx',
              type: 'file',
              content: 'export default function Button() {\n  return <button>Click me</button>;\n}',
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          ],
        },
        {
          id: 'folder-utils',
          name: 'utils',
          type: 'folder',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          children: [
            {
              id: 'file-helpers',
              name: 'helpers.ts',
              type: 'file',
              content: 'export const formatDate = (date: Date): string => {\n  return date.toLocaleDateString();\n};\n',
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          ],
        },
        {
          id: 'file-index',
          name: 'index.ts',
          type: 'file',
          content: "export * from './components';\nexport * from './utils';\n",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
    },
    {
      id: 'folder-public',
      name: 'public',
      type: 'folder',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      children: [
        {
          id: 'file-readme',
          name: 'README.md',
          type: 'file',
          content: '# Mini File Explorer\n\nA modern file explorer built with Next.js.\n',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
    },
    {
      id: 'file-package-json',
      name: 'package.json',
      type: 'file',
      content: '{\n  "name": "mini-file-explorer",\n  "version": "0.1.0"\n}\n',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ],
};
